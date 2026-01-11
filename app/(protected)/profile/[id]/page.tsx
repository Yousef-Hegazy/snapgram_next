import StatBlock from "@/components/shared/StatBlock";
import FollowButton from "@/components/shared/UserCard/FollowButton";
import { user } from "@/db/auth-schema";
import { db } from "@/db/client";
import { follows, likes, posts, saves } from "@/db/db-schema";
import { DEFAULT_CACHE_DURATION } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { getCurrentUser } from "@/server/lib/auth";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import ProfileTabs from "./ProfileTabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    activeTab?: string;
  }>;
};

const getUserDetails = async (id: string, currentUserId?: string) => {
  "use cache";

  cacheLife({ revalidate: DEFAULT_CACHE_DURATION });
  cacheTag(QUERY_KEYS.GET_USER_BY_ID + id);

  // Normalize incoming id - sometimes route params can include extra segments (e.g. "id,1")
  const userId = String(id).split(",")[0].trim();

  try {
    const rows = await db
      .select({
        ...getTableColumns(user),
        postCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${posts} WHERE ${posts.creatorId} = ${userId}
      )`,
        followersCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${follows} WHERE ${follows.followeeId} = ${userId}
      )`,
        followeesCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${follows} WHERE ${follows.followerId} = ${userId}
      )`,
        likeCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${likes} WHERE ${likes.postId} IN (
          SELECT ${posts.id} FROM ${posts} WHERE ${posts.creatorId} = ${userId}
        )
      )`,
        saveCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${saves} WHERE ${saves.postId} IN (
          SELECT ${posts.id} FROM ${posts} WHERE ${posts.creatorId} = ${userId}
        )
      )`,
        isFollowing: currentUserId
          ? sql<boolean>`EXISTS(
            SELECT 1 FROM ${follows} WHERE ${follows.followerId} = ${currentUserId} AND ${follows.followeeId} = ${userId}
          )`
          : sql<boolean>`false`,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return rows && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("getUserDetails error", error, { id, userId });
    return null;
  }
};

const ProfilePage = async ({ params, searchParams }: Props) => {
  const [{ id }, currentUser, sp] = await Promise.all([params, getCurrentUser(), searchParams]);

  const activeTab = sp?.activeTab || "posts";

  const currentUserId = currentUser?.id || "";

  const profile = await getUserDetails(id, currentUserId);

  const isCurrentUser = profile ? profile.id === currentUserId : false;

  return (
    <div className="profile-container">
      {profile ? (
        <>
          <div className="profile-inner_container">
            <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
              <div className="relative w-28 h-28 lg:h-36 lg:w-36 rounded-full overflow-hidden">
                <Image
                  src={profile.imageUrl || "/icons/profile-placeholder.svg"}
                  alt="profile"
                  fill
                  className="object-top object-cover"
                />
              </div>

              <div className="flex flex-col flex-1 justify-between md:mt-2">
                <div className="flex flex-col w-full">
                  <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">{profile.name}</h1>
                  <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                    @{profile.username}
                  </p>
                </div>

                <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                  <StatBlock value={profile.postCount} label="Posts" />
                  <StatBlock value={profile.followersCount} label="Followers" />
                  <StatBlock value={profile.followeesCount} label="Following" />
                  <StatBlock value={profile.likeCount} label="Likes" />
                  <StatBlock value={profile.saveCount} label="Saves" />
                </div>

                <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                  {profile.bio}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <div className={`${!isCurrentUser && `hidden`}`}>
                  <Link
                    href={`/profile/${profile.id}/update`}
                    className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                      !isCurrentUser && "hidden"
                    }`}
                  >
                    <Image src={"/icons/edit.svg"} alt="edit" width={20} height={20} className="inline-block" />
                    <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
                  </Link>
                </div>

                {!isCurrentUser ? <FollowButton user={profile} currentUserId={currentUserId} /> : null}
              </div>
            </div>
          </div>

          <ProfileTabs
            activeTab={activeTab}
            profileId={profile.id}
            currentUserId={currentUserId}
            isCurrentUser={isCurrentUser}
          />
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default ProfilePage;
