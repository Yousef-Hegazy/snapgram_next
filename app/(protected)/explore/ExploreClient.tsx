"use client";

import GridPostList from "@/components/shared/GridPostList";
import InfiniteQueryContainer from "@/components/shared/InfiniteQueryContainer";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { useGetInfinitePosts } from "@/lib/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import Image from "next/image";
import { useState } from "react";

type Props = {
  currentUserId?: string;
};

const ExploreClient = ({ currentUserId }: Props) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const {
    data: posts,
    isPending: isPendingPosts,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePosts({ limit: 10, currentUserId: currentUserId || "", query: debouncedQuery });

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>

        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <Image src="/icons/search.svg" width={24} height={24} alt="search" />

          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>

          <Image src="/icons/filter.svg" width={20} height={20} alt="filter" />
        </div>
      </div>

      <InfiniteQueryContainer hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} shouldFetch={!debouncedQuery}>
        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {isPendingPosts ? (
            <Loader />
          ) : !posts ? (
            <div></div>
          ) : (
            posts.pages.map((page, index) => (
              <GridPostList key={`page-${index}`} posts={page.items} currentUserId={currentUserId || ""} />
            ))
          )}
        </div>
      </InfiniteQueryContainer>
    </div>
  );
};

export default ExploreClient;
