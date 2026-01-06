"use client";

import Loader from "@/components/ui/Loader";
import { Post } from "@/db/schema-types";
import { useLikePost, useSavePost } from "@/lib/react-query";
import { cn } from "@/lib/utils";

export function PostStats({
  post,
  userId,
  isLikedPosts = false,
  isSavedPosts = false,
}: {
  post: Post;
  userId: string;
  isLikedPosts?: boolean;
  isSavedPosts?: boolean;
}) {
  const isLiked = isLikedPosts || post.likes?.some((l) => l.user?.toString() === userId);
  const isSaved = isSavedPosts || post.save?.some((s) => s.user?.toString() === userId);

  const { mutate: likePost, isPending: isLikingPost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    likePost({ postId: post.$id, userId });
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    savePost({ postId: post.$id, userId });
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <button className="cursor-pointer" onClick={handleLikeClick} disabled={isLikingPost}>
          <div className={cn("size-5", !isLikingPost && "hidden")}>
            <Loader />
          </div>

          <img
            className={isLiked || isLikingPost ? "hidden" : ""}
            src="/icons/like.svg"
            alt="heart"
            width={20}
            height={20}
          />

          <img
            className={!isLiked || isLikingPost ? "hidden" : ""}
            src="/icons/liked.svg"
            alt="heart"
            width={20}
            height={20}
          />
        </button>

        <p className="small-medium lg:base-medium">{post.likesCount}</p>
      </div>

      <button className="cursor-pointer" onClick={handleSaveClick} disabled={isSavingPost}>
        <div className={cn("size-5", !isSavingPost && "hidden")}>
          <Loader />
        </div>

        <img
          className={isSaved || isSavingPost ? "hidden" : ""}
          src="/icons/save.svg"
          alt="save"
          width={20}
          height={20}
        />

        <img
          className={!isSaved || isSavingPost ? "hidden" : ""}
          src="/icons/saved.svg"
          alt="saved"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
