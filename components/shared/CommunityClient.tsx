"use client";

import InfiniteQueryContainer from "@/components/shared/InfiniteQueryContainer";
import UserCard from "@/components/shared/UserCard";
import Loader from "@/components/ui/Loader";
import type { User } from "@/db/schema-types";
import { useGetInfiniteUsers } from "@/lib/react-query/users";

type Props = {
  currentUserId?: string;
};

export default function CommunityClient({ currentUserId = "" }: Props) {
  const { data: users, isPending, fetchNextPage, hasNextPage } = useGetInfiniteUsers(10, currentUserId);

  return (
    <InfiniteQueryContainer fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}>
      {isPending ? (
        <Loader />
      ) : users?.pages && users.pages.length > 0 ? (
        <ul className="user-grid">
          {users.pages.map((page) =>
            page.items.map((u) => (
              <li key={u.id}>
                <UserCard user={u as unknown as User} currentUserId={currentUserId} />
              </li>
            ))
          )}
        </ul>
      ) : (
        <p className="text-light-2 mt-4">No users found.</p>
      )}
    </InfiniteQueryContainer>
  );
}
