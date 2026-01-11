import { getCurrentUser } from "@/server/lib/auth";
import ExploreClient from "./ExploreClient";

const ExplorePage = async () => {
  const user = await getCurrentUser();

  return <ExploreClient currentUserId={user?.id} />;
};

export default ExplorePage;
