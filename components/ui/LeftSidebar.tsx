"use client";

// import { useAuthContext } from "@/context/AuthContext";
import { authClient } from "@/auth-client";
import { User } from "@/db/schema-types";
import { sidebarLinks } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import LeftSidebarLink from "./LeftSidebarLink";
import TopbarLogoutBtn from "./TopbarLogoutBtn";

const LeftSidebar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user as User;

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link href="/" className="flex gap-3 items-center">
          <Image src="/images/logo.svg" alt="Snapgram Logo" width={170} height={36} />
        </Link>

        <Link href={`/profile/${user?.id}`} className="flex gap-3 items-center">
          <Image
            src={user?.imageUrl || "/images/profile-placeholder.svg"}
            alt="profile"
            width={56}
            height={56}
            className="rounded-full"
          />

          <div className="flex flex-col">
            <p className="body-bold">{user?.name}</p>
            <p className="small-regular text-light-3">@{user?.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((l) => (
            <LeftSidebarLink key={l.route} link={l} />
          ))}
        </ul>
      </div>

      <TopbarLogoutBtn>
        <span className="small-medium lg:base-medium">Logout</span>
      </TopbarLogoutBtn>
    </nav>
  );
};

export default LeftSidebar;
