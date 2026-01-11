import { formatTimeAgo } from "@/lib/helpers/dateHelpers";
import type { PostWithMetadata } from "@/types/posts";
import Image from "next/image";
import Link from "next/link";
import { PostStats } from "./PostStats";

type Props = {
  post: PostWithMetadata;
  currentUserId?: string;
};

const PostCard = ({ post, currentUserId }: Props) => {
  const creator = post.creator;
  
  return (
    <li className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.creatorId}`}>
            <Image
              src={creator?.imageUrl || "/icons/profile-placeholder.svg"}
              alt="creator"
              width={48}
              height={48}
              className="rounded-full size-12 overflow-hidden object-top object-cover"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{creator?.name}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">{formatTimeAgo(post.createdAt)}</p>
              <p>-</p>
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>

        {currentUserId === creator?.id ? (
          <Link href={`/posts/${post.id}/edit`}>
            <Image src="/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>
        ) : null}
      </div>

      <Link href={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags?.map((tag) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative post-card_img overflow-hidden">
          <Image src={post.imageUrl || "/icons/profile-placeholder.svg"} alt={"post-image" + post.id} fill className="object-fill" />
        </div>
      </Link>

      <PostStats post={post} userId={currentUserId} />
    </li>
  );
};

export default PostCard;
