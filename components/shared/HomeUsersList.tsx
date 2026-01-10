import { user } from "@/db/auth-schema";
import { db } from "@/db/client";
import { follows, posts } from "@/db/db-schema";
import { getTableColumns, sql, and, eq, desc } from "drizzle-orm";
import UserCard from "./UserCard";
import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_CACHE_DURATION } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

type Props = {
  currentUserId: string;
};

const getUsersList = async (currentUserId: string) => {
  "use cache";

  cacheLife({ revalidate: DEFAULT_CACHE_DURATION });

  cacheTag(QUERY_KEYS.GET_USERS);

  try {
    const creators = await db
      .select({
        ...getTableColumns(user),
        isFollowing: sql<boolean>`CASE WHEN ${follows.id} IS NOT NULL THEN true ELSE false END`,
        postCount: sql<number>`COUNT(${posts.id})`,
      })
      .from(user)
      .limit(10)
      .leftJoin(posts, eq(posts.creatorId, user.id))
      .leftJoin(follows, and(eq(follows.followeeId, user.id), eq(follows.followerId, currentUserId)))
      .groupBy(user.id, follows.id)
      .orderBy(desc(sql`COUNT(${posts.id})`));
    return creators;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

const HomeUsersList = async ({ currentUserId }: Props) => {
  const creators = await getUsersList(currentUserId);

  return (
    <>
      <h3 className="h3-bold text-light-1">Top Creators</h3>
      {creators && creators.length > 0 ? (
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {creators.map((creator) => (
            <li key={creator.id}>
              <UserCard user={creator} currentUserId={currentUserId} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-medium text-light-1">No creators found</p>
      )}
    </>
  );
};

export default HomeUsersList;
