import PostForm from "@/components/shared/PostForm";
import { db } from "@/db/client";
import { posts } from "@/db/db-schema";
import { getCurrentUser } from "@/server/lib/auth";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

const getPostById = async (postId: string) => {
  try {
    const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    return post;
  } catch (error) {
    console.log("Error fetching post:", error);
    return null;
  }
};

type Props = {
  params: Promise<{ id: string }>;
};

const EditPostPage = async ({ params }: Props) => {
  const { id } = await params;
  const [user, post] = await Promise.all([getCurrentUser(), getPostById(id)]);

  if (!user) {
    return redirect("/sign-in", RedirectType.replace);
  }

  return (
    <div className="flex flex-1 w-full">
      <div className="common-container">
        <div className="max-w-5xl mx-auto flex-start gap-3 w-full">
          <Image src="/icons/edit.svg" width={36} height={36} alt="Edit Post" className="invert-white" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {post ? (
          <PostForm post={post} user={user} />
        ) : (
          <p className="text-center font-semibold text-lg mt-10 text-light-1">Post not found.</p>
        )}
      </div>
    </div>
  );
};

export default EditPostPage;
