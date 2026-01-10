import SavedPostsClient from "@/components/shared/SavedPostsClient";
import { getCurrentUser } from "@/server/lib/auth";
import Image from "next/image";

const SavedPostsPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl items-center">
        <Image src="/icons/save.svg" width={36} height={36} alt="saves" className="invert-white" />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved posts</h2>
      </div>
      <SavedPostsClient currentUserId={user?.id || ""} />
    </div>
  );
};

export default SavedPostsPage;
