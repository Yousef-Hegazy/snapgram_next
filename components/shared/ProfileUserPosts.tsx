"use client";

import { useGetInfinitePosts } from "@/lib/react-query";
import Loader from "../ui/Loader";
import GridPostList from "./GridPostList";
import InfiniteQueryContainer from "./InfiniteQueryContainer";

type Props = {
  userId: string;
  currentUserId: string;
};

const ProfileUserPosts = ({ userId, currentUserId }: Props) => {
  const {
    data: posts,
    isPending,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePosts({ currentUserId, creatorId: userId });

  return (
    <InfiniteQueryContainer fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}>
      {isPending ? (
        <Loader />
      ) : posts && posts.pages ? (
        posts.pages.map((page, index) => (
          <GridPostList
            key={`page-${index}`}
            posts={page.items}
            showUser={false}
            currentUserId={currentUserId}
            showStats
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </InfiniteQueryContainer>
  );
};

export default ProfileUserPosts;
