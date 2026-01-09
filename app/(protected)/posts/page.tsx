import { PostsList } from "@/components/shared/PostsList";
import { getCurrentUser } from "@/server/lib/auth";

const PostsPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-row flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          <PostsList currentUserId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
