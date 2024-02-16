"use server";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

// Get details of currently logged in user along with sidebarOptions and permissions field
export const getUserAuthDetaills = async () => {
  // current user from Clerk
  const user = await currentUser();

  if (!user) return;

  // getting data of the current user from Prisma
  const userData = db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      // return the sidebarOption field within agency
      agency: {
        include: {
          sidebarOption: true,
          subAccount: {
            include: {
              sidebarOptions: true,
            },
          },
        },
      },
      // get all the fields of permission
      permissions: true,
    },
  });

  return userData;
};

// Make user part of the agency
// Parameters of agencyId and user details we get from Clerk
const createTeamUser = async (agencyId: string, user: User) => {
  // the ownder already has the permissions
  if (user.role === "AGENCY_OWNER") return null;

  // create the user in the db
  const res = await db.user.create({
    data: { ...user },
  });

  return res;
};

// Function to create notification field and save it
export const saveActivityLogNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string;
  description: string;
  subAccountId?: string;
}) => {
  const user = await currentUser();
  let userData; // the data from the database

  // if there's no logged in user, find the user with subAccountId
  if (!user) {
    const dbUser = await db.user.findFirst({
      where: {
        agency: {
          subAccount: {
            some: { id: subAccountId },
          },
        },
      },
    });

    if (dbUser) userData = dbUser;
  } else {
    // else use the email address to get the user data
    userData = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  if (!userData) {
    throw new Error("Could not find a user");
  }

  let foundAgencyId = agencyId;

  if (!agencyId) {
    // if both agency Id ad subaccount Id is not provided
    if (!subAccountId) {
      throw new Error(
        "You need to provide at least an agency Id or subaccound Id"
      );
    }
    // if agency Id is provided
    const agency = await db.agency.findUnique({
      where: {
        id: agencyId,
      },
    });

    if (agency) return (foundAgencyId = agency.id);
  }

  // if subaccount Id is provided
  if (subAccountId) {
    // create a new notification field with subaccount Id included
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        subAccount: {
          connect: {
            id: subAccountId,
          },
        },
      },
    });
  } else {
    // else create notification without subaccount Id
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

// Verify the invitation send by the agency
export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    // call function to create the user
    // pass agencyId and relevant user details from Clerk to comply with User model from Prisma
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      id: user.id,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      role: invitationExists.role,
      name: `${user.firstName} + ${user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // call the function to save notification
    await saveActivityLogNotification({
      agencyId: invitationExists.agencyId,
      description: "Joined",
      subAccountId: undefined,
    });

    // if the user was created successfully
    if (userDetails) {
      // update the clerk user metadata to include the user's role from prisma DB
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });

      // Delete the invitation

      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      });

      return userDetails.agencyId;
    } else return null; // if the user creation failed
  } else {
    // if there's no invitationn, check if the user is already part of the agency
    const userDB = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    // return agencyId if user has agencyId
    return userDB ? userDB.agencyId : null;
  }
};
