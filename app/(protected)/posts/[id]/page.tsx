import { PostStats } from "@/components/shared/PostCard/PostStats";
import { user } from "@/db/auth-schema";
import { db } from "@/db/client";
import { likes, posts, saves } from "@/db/db-schema";
import { DEFAULT_CACHE_DURATION } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { formatTimeAgo } from "@/lib/helpers/dateHelpers";
import { getCurrentUser } from "@/server/lib/auth";
import { PostWithMetadata } from "@/types/posts";
import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import DeletePostBtn from "./DeletePostBtn";

type Props = {
  params: Promise<{ id: string }>;
};

const getPostDetails = async (postId: string, currentUserId?: string) => {
  "use cache";
  cacheLife({
    revalidate: DEFAULT_CACHE_DURATION,
  });

  cacheTag(QUERY_KEYS.GET_POST_BY_ID + postId);

  try {
    const [post] = await db
      .select({
        id: posts.id,
        caption: posts.caption,
        tags: posts.tags,
        imageUrl: posts.imageUrl,
        imageId: posts.imageId,
        location: posts.location,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        creatorId: posts.creatorId,
        creator: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          imageUrl: user.imageUrl,
          bio: user.bio,
        },
        likesCount: sql<number>`(
                                SELECT COUNT(*)::int FROM ${likes} 
                                WHERE ${likes.postId} = ${posts.id}
                            )`,
        savesCount: sql<number>`(
                                SELECT COUNT(*)::int FROM ${saves} 
                                WHERE ${saves.postId} = ${posts.id}
                            )`,
        isLikedByUser: currentUserId
          ? sql<boolean>`EXISTS(
                                    SELECT 1 FROM ${likes} 
                                    WHERE ${likes.postId} = ${posts.id} 
                                    AND ${likes.userId} = ${currentUserId}
                                )`
          : sql<boolean>`false`,
        isSavedByUser: currentUserId
          ? sql<boolean>`EXISTS(
                                    SELECT 1 FROM ${saves} 
                                    WHERE ${saves.postId} = ${posts.id} 
                                    AND ${saves.userId} = ${currentUserId}
                                )`
          : sql<boolean>`false`,
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .leftJoin(user, eq(posts.creatorId, user.id))
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(1);

    return post as unknown as PostWithMetadata | null;
  } catch (error) {
    console.log("Error fetching post details:", error);
    return null;
  }
};

const PostDetails = async ({ params }: Props) => {
  const [{ id }, user] = await Promise.all([params, getCurrentUser()]);
  const post = await getPostDetails(id, user?.id);

  return (
    <div className="post_details-container">
      {!post ? (
        <div>Post not found</div>
      ) : (
        <div className="post_details-card">
          <div className="post_details-img relative overflow-hidden">
            <Image src={post.imageUrl} alt={post.caption || "post"} fill className="object-fill" />
          </div>

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link className="flex items-center gap-3" href={`/profile/${post.creator?.id}`}>
                <Image
                  src={post.creator?.imageUrl || "/icons/profile-placeholder.svg"}
                  alt="creator"
                  width={48}
                  height={48}
                  className="rounded-full size-12 object-cover object-top"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post.creator?.name}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">{formatTimeAgo(post.createdAt)}</p>
                    <p>-</p>
                    <p className="subtle-semibold lg:small-regular">{post.location}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-2">
                {user?.id === post.creator?.id ? (
                  <>
                    <Link href={`/posts/${post.id}/edit`}>
                      <Image src="/icons/edit.svg" alt="edit" width={24} height={24} />
                    </Link>

                    <DeletePostBtn postId={post.id} userId={user?.id || ""} />
                  </>
                ) : null}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags?.map((tag) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user?.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
