"use client";

import type { PostWithMetadata } from "@/types/posts";
import Link from "next/link";
import Image from "next/image";
import { PostStats } from "./PostCard/PostStats";

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
  currentUserId,
}: {
  posts: PostWithMetadata[];
  showUser?: boolean;
  showStats?: boolean;
  currentUserId?: string;
}) => {
  return (
    <ul className="grid-container">
      {posts.map((post) => {
        return (
          <li key={post.id} className="relative min-w-80 h-80">
            <Link href={`/posts/${post.id}`} className="grid-post_link relative">
              <Image
                src={post.imageUrl}
                alt={post.caption || "post"}
                fill
                className="object-cover w-full h-full"
              />
            </Link>

            <div className="grid-post_user">
              {showUser ? (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <Image
                    src={post.creator?.imageUrl || "/icons/profile-placeholder.svg"}
                    alt={post.creator?.name || "creator"}
                    width={32}
                    height={32}
                    className="rounded-full overflow-hidden object-top object-cover shrink-0 size-8"
                  />

                  <p className="line-clamp-1">{post.creator?.name ?? "Unknown"}</p>
                </div>
              ) : null}

              {showStats ? <PostStats post={post} userId={currentUserId} /> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
