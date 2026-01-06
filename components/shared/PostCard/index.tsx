import { formatTimeAgo } from "@/lib/helpers/dateHelpers";
import type { IUser } from "@/types";
import { PostStats } from "./PostStats";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/db/schema-types";

type Props = {
  post: Post;
  currentUser: IUser;
};

const PostCard = ({ post, currentUser }: Props) => {
  return (
    <li className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.creatorId}`}>
            <Image
              src={post.creatorId || "/icons/profile-placeholder.svg"}
              alt="creator"
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{post.creatorId}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">{formatTimeAgo(post.createdAt.toISOString())}</p>
              <p>-</p>
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>

        {currentUser.id === post.creatorId ? (
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

        <Image
          src={post.imageUrl || "/icons/profile-placeholder.svg"}
          alt={"post-image" + post.id}
          className="post-card_img"
          height={450}
        />
      </Link>

      <PostStats post={post} userId={currentUser.id} />
    </li>
  );
};

export default PostCard;
