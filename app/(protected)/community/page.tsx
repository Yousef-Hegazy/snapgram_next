import CommunityClient from "@/components/shared/CommunityClient";
import { getCurrentUser } from "@/server/lib/auth";

const CommunityPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <CommunityClient currentUserId={user?.id || ""} />
      </div>
    </div>
  );
};

export default CommunityPage;
