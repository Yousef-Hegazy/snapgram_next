import PostForm from "@/components/shared/PostForm";
import { getCurrentUser } from "@/server/lib/auth";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

const CreatePostPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in", RedirectType.replace);
  }

  return (
    <div className="flex flex-1 w-full">
      <div className="common-container">
        <div className="max-w-5xl mx-auto flex-start gap-3 w-full">
          <Image src="/icons/add-post.svg" width={36} height={36} alt="Add Post" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <PostForm user={user} />
      </div>
    </div>
  );
};

export default CreatePostPage;
