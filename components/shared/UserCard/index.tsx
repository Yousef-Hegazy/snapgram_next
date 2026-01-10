import { Button } from "@/components/ui/button";
import type { User } from "@/db/schema-types";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";

type Props = {
  user: User & { isFollowing?: boolean };
  currentUserId: string;
};

const UserCard = ({ user, currentUserId }: Props) => {
  const isCurrentUser = user.id === currentUserId;

  return (
    <Link href={`/profile/${user.id}`} className="user-card">
      <Image
        src={user.imageUrl ? user.imageUrl : "/icons/profile-placeholder.svg"}
        alt={user.name}
        width={56}
        height={56}
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">{user.name}</p>

        <p className="small-regular text-light-3 text-center line-clamp-1">@{user.username}</p>
      </div>

      {isCurrentUser ? (
        <Button type="button" size="sm" className="shad-button_dark_4 px-5 pointer-events-none">
          You
        </Button>
      ) : (
        <FollowButton user={user} currentUserId={currentUserId} />
      )}
    </Link>
  );
};

export default UserCard;
