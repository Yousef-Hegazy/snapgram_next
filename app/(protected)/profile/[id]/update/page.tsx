import UpdateProfileForm from "@/components/profile/UpdateProfileForm";
import { user } from "@/db/auth-schema";
import { db } from "@/db/client";
import { DEFAULT_CACHE_DURATION } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { getCurrentUser } from "@/server/lib/auth";
import { eq, getTableColumns } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

type Props = {
  params: Promise<{ id: string }>;
};

const getUserForEdit = async (id: string) => {
  "use cache";

  cacheLife({ revalidate: DEFAULT_CACHE_DURATION });
  cacheTag(QUERY_KEYS.GET_USER_BY_ID + id);

  const userId = String(id).split(",")[0].trim();

  const rows = await db
    .select({ ...getTableColumns(user) })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return rows && rows.length > 0 ? rows[0] : null;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const userForEdit = await getUserForEdit(id);

  if (!userForEdit) return <div className="common-container">User not found</div>;

  // If not the current user, show forbidden
  if (!currentUser || currentUser.id !== userForEdit.id) {
    return <div className="common-container">You are not authorized to edit this profile</div>;
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <UpdateProfileForm user={userForEdit} />
      </div>
    </div>
  );
};

export default Page;
