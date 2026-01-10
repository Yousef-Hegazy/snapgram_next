"use client";

import PostCard from "@/components/shared/PostCard";
import Loader from "@/components/ui/Loader";
import InfiniteQueryContainer from "@/components/shared/InfiniteQueryContainer";
import { useGetInfinitePosts } from "@/lib/react-query/posts";

type Props = {
  currentUserId?: string;
};

export function PostsList({ currentUserId }: Props) {
  const {
    data: posts,
    isPending,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePosts(10, currentUserId || "");

  if (isPending) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <InfiniteQueryContainer
      hasNextPage={hasNextPage || false}
      fetchNextPage={fetchNextPage}
    >
      <ul className="flex flex-col flex-1 gap-9 w-full">
        {posts?.pages.map((page, pageIndex) =>
          page.items.map((post) => (
            <PostCard
              key={`${pageIndex}-${post.id}`}
              post={post}
              currentUserId={currentUserId}
            />
          ))
        )}
      </ul>

      {/* {!hasNextPage && posts?.pages[0]?.items.length ? (
        <p className="text-light-4 text-center mt-4">No more posts to load</p>
      ) : null} */}
    </InfiniteQueryContainer>
  );
}
