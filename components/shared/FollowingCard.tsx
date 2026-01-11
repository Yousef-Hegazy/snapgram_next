import { usersApi } from "@/lib/hono-client";
import { useToggleFollowUser } from "@/lib/react-query";
import { InferResponseType } from "hono/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Loader from "../ui/Loader";

type Props = {
  follow: InferResponseType<typeof usersApi.$get>["data"]["items"][number];
  currentUserId: string;
};

const FollowingCard = ({ follow, currentUserId }: Props) => {
  const { mutate: unfollow, isPending: isUnfollowing } = useToggleFollowUser();

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    unfollow({
      userId: follow.id,
      followerId: currentUserId,
    });
  };

  return (
    <Link href={`/profile/${follow.id}`} className="user-card">
      <div className="rounded-full w-14 h-14 relative overflow-hidden">
        <Image
          src={follow.imageUrl || "/icons/profile-placeholder.svg"}
          alt={follow.name}
          fill
          className="object-top object-cover"
        />
      </div>

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">{follow.name}</p>

        <p className="small-regular text-light-3 text-center line-clamp-1">@{follow.username}</p>
      </div>

      <Button onClick={handleFollow} type="button" size="sm" className="px-5 shad-button_dark_4">
        {isUnfollowing ? <Loader /> : "Unfollow"}
      </Button>
    </Link>
  );
};

export default FollowingCard;
