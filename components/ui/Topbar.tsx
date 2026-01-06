import { User } from "@/db/schema-types";
import Image from "next/image";
import Link from "next/link";
import TopbarLogoutBtn from "./TopbarLogoutBtn";

const Topbar = ({ user }: { user: User }) => {
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link href="/" className="flex gap-3 items-center">
          <Image src="/images/logo.svg" alt="Snapgram Logo" width={130} height={130} />
        </Link>

        <div className="flex gap-4">
          <TopbarLogoutBtn />

          <Link href={`/profile/${user.id}`} className="flex-center gap-3">
            <Image
              src={user.imageUrl || "/images/profile-placeholder.svg"}
              alt="profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
