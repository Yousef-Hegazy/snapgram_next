"use client";

import Followers from "@/components/shared/Followers";
import Followings from "@/components/shared/Followings";
import LikedPosts from "@/components/shared/LikedPosts";
import ProfileUserPosts from "@/components/shared/ProfileUserPosts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, List, PersonStanding, Users } from "lucide-react";
import Link from "next/link";

type Props = {
  activeTab: string;
  profileId: string;
  currentUserId?: string;
  isCurrentUser: boolean;
};

const ProfileTabs = ({ activeTab, profileId, currentUserId, isCurrentUser }: Props) => {
  return (
    <div className="w-full max-w-5xl">
      <Tabs defaultValue={activeTab} className="items-center gap-9">
        <TabsList className="rounded-md flex-wrap w-full h-auto">
          <TabsTrigger asChild value="posts" className="profile-tab">
            <Link scroll={false} href="?activeTab=posts">
              <List className="size-4" />
              <span>Posts</span>
            </Link>
          </TabsTrigger>

          {isCurrentUser ? (
            <>
              <TabsTrigger asChild value="liked-posts" className="profile-tab">
                <Link scroll={false} href="?activeTab=liked-posts">
                  <Heart className="size-4" />
                  <span>Liked Posts</span>
                </Link>
              </TabsTrigger>

              <TabsTrigger asChild value="followings" className="profile-tab">
                <Link scroll={false} href="?activeTab=followings">
                  <PersonStanding className="size-5" />
                  <span>Followings</span>
                </Link>
              </TabsTrigger>

              <TabsTrigger asChild value="followers" className="profile-tab">
                <Link scroll={false} href="?activeTab=followers">
                  <Users className="size-4" />
                  <span>Followers</span>
                </Link>
              </TabsTrigger>
            </>
          ) : null}
        </TabsList>

        <TabsContent value="posts" className="w-full">
          <ProfileUserPosts userId={profileId} currentUserId={currentUserId || ""} />
        </TabsContent>

        {isCurrentUser ? (
          <>
            <TabsContent value="liked-posts" className="w-full">
              <LikedPosts userId={profileId} currentUserId={currentUserId || ""} />
            </TabsContent>

            <TabsContent value="followings" className="w-full">
              <Followings userId={profileId} currentUserId={currentUserId || ""} />
            </TabsContent>

            <TabsContent value="followers" className="w-full">
              <Followers userId={profileId} currentUserId={currentUserId || ""} />
            </TabsContent>
          </>
        ) : null}
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
