import HomeUsersList from "@/components/shared/HomeUsersList";
import { PostsList } from "@/components/shared/PostsList";
import Loader from "@/components/ui/Loader";
import { getCurrentUser } from "@/server/lib/auth";
import { Suspense } from "react";

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
      <div className="home-creators">
        <Suspense fallback={<Loader />}>
          <HomeUsersList currentUserId={user?.id || ""} />
        </Suspense>
      </div>
    </div>
  );
};

export default PostsPage;
