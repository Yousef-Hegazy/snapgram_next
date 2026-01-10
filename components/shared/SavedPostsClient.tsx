"use client";

import GridPostList from "@/components/shared/GridPostList";
import InfiniteQueryContainer from "@/components/shared/InfiniteQueryContainer";
import Loader from "@/components/ui/Loader";
import { useGetInfiniteSavedPosts } from "@/lib/react-query/posts";

type Props = {
  currentUserId: string;
};

export default function SavedPostsClient({ currentUserId }: Props) {
  const { data: saved, isPending, fetchNextPage, hasNextPage } = useGetInfiniteSavedPosts(10, currentUserId);

  return (
    <InfiniteQueryContainer fetchNextPage={fetchNextPage as () => void} hasNextPage={Boolean(hasNextPage)} shouldFetch>
      {isPending ? (
        <Loader />
      ) : saved && saved.pages && saved.pages.length > 0 ? (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {saved.pages.map((page, pageIndex) => (
            <GridPostList key={`page-${pageIndex}`} posts={page.items} currentUserId={currentUserId} />
          ))}
        </ul>
      ) : (
        <p className="text-light-4">No available posts</p>
      )}
    </InfiniteQueryContainer>
  );
}
