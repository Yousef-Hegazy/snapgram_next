"use client";

import { useGetInfinitePosts } from "@/lib/react-query";
import Loader from "../ui/Loader";
import GridPostList from "./GridPostList";
import InfiniteQueryContainer from "./InfiniteQueryContainer";

type Props = {
  userId: string;
  currentUserId: string;
};

const LikedPosts = ({ userId, currentUserId }: Props) => {
  const {
    data: posts,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePosts({
    currentUserId: currentUserId,
    likedId: userId,
  });

  return (
    <InfiniteQueryContainer fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}>
      {isPending ? (
        <Loader />
      ) : !posts || !posts.pages || isError ? (
        <p>No liked posts found.</p>
      ) : (
        posts.pages.map((page, index) => (
          <GridPostList key={`page-${index}`} posts={page.items} currentUserId={currentUserId} showStats showUser />
        ))
      )}
    </InfiniteQueryContainer>
  );
};

export default LikedPosts;
