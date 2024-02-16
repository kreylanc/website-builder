import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/site", "/api/uploadthing"],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    // rewrite for domains
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    let hostname = req.headers;

    const pathWithParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // if sub domain exists

    // split the hostname with our public domain, and filter any falsy values then get the first element of the array
    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    if (customSubDomain) {
      // reroute users to the path with custom subdomain and search params
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithParams}`, req.url)
      );
    }

    // if accessing sign in/up page
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.rewrite(new URL(`/agency/sign-in`, req.url));
    }

    // if the domain only or domain/site while the domai is our public(main) domain
    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      // redirect to home page
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
      url.pathname.startsWith("/agency") ||
      url.pathname.startsWith("/subaccout")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithParams}`, req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
