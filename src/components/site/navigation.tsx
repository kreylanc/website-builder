import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { User } from "@clerk/nextjs/server";

type NavigationProps = {
  user?: null | User;
};
const Navigation = ({ user }: NavigationProps) => {
  return (
    <header className="flex p-4 items-center justify-between">
      <div className="relative flex">
        <Image
          src="/assets/plura-logo.svg"
          alt="Plura logo"
          height={40}
          width={40}
        />
        <span className="font-bold text-xl ml-2">Plura.</span>
      </div>
      <nav className="hidden md:block mx-auto">
        <ul className="flex gap-x-8 items-center justify-center">
          <li>
            <Link href="#">Pricing</Link>
          </li>
          <li>
            <Link href="#">About</Link>
          </li>
          <li>
            <Link href="#">Documentation</Link>
          </li>
          <li>
            <Link href="#">Features</Link>
          </li>
        </ul>
      </nav>
      {/* Login, or User button and theme switcher  */}
      <div className="flex items-center gap-x-4">
        <Link
          href="/agency"
          className="bg-primary text-primary-foreground p-2 px-4 rounded-md hover:bg-primary/80"
        >
          Login
        </Link>
        {user ? <UserButton /> : null}
        <ModeToggle />
      </div>
    </header>
  );
};

export default Navigation;
