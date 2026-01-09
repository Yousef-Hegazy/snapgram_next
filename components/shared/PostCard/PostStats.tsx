"use client";

import Loader from "@/components/ui/Loader";
import type { PostWithMetadata } from "@/types/posts";
import { useLikePost, useSavePost } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function PostStats({
  post,
  userId,
}: {
  post: PostWithMetadata;
  userId?: string;
}) {
  const isLiked = post.isLikedByUser;
  const isSaved = post.isSavedByUser;

  const { mutate: likePost, isPending: isLikingPost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!userId) return;
    likePost({ postId: post.id, userId });
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!userId) return;
    savePost({ postId: post.id, userId });
  };

  return (
    <div className="flex justify-between items-center z-20 mt-4">
      <div className="flex gap-2 mr-5">
        <button 
          className="cursor-pointer disabled:opacity-50" 
          onClick={handleLikeClick} 
          disabled={isLikingPost || !userId}
        >
          <div className={cn("size-5", !isLikingPost && "hidden")}>
            <Loader />
          </div>

          <Image
            className={isLiked || isLikingPost ? "hidden" : ""}
            src="/icons/like.svg"
            alt="heart"
            width={20}
            height={20}
          />

          <Image
            className={!isLiked || isLikingPost ? "hidden" : ""}
            src="/icons/liked.svg"
            alt="heart"
            width={20}
            height={20}
          />
        </button>

        <p className="small-medium lg:base-medium">{post.likesCount}</p>
      </div>

      <button 
        className="cursor-pointer disabled:opacity-50" 
        onClick={handleSaveClick} 
        disabled={isSavingPost || !userId}
      >
        <div className={cn("size-5", !isSavingPost && "hidden")}>
          <Loader />
        </div>

        <Image
          className={isSaved || isSavingPost ? "hidden" : ""}
          src="/icons/save.svg"
          alt="save"
          width={20}
          height={20}
        />

        <Image
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
