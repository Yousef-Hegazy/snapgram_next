"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { User } from "@/db/schema-types";
import { useToggleFollowUser } from "@/lib/react-query";
import { cn } from "@/lib/utils";

type Props = {
  user: User & { isFollowing?: boolean };
  currentUserId: string;
};

const FollowButton = ({ user, currentUserId }: Props) => {
  const { mutate: toggleFollow, isPending: isTogglingFollow } = useToggleFollowUser();

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFollow({ userId: user.id, followerId: currentUserId });
  };

  return (
    <Button
      onClick={handleFollow}
      type="button"
      size="sm"
      className={cn("px-5", {
        "shad-button_primary": !user.isFollowing,
        "shad-button_dark_4": user.isFollowing,
      })}
    >
      {isTogglingFollow ? <Loader /> : user.isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
