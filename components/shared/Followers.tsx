"use client";

import { User } from "@/db/schema-types";
import { useGetInfiniteUsers } from "@/lib/react-query";
import Loader from "../ui/Loader";
import InfiniteQueryContainer from "./InfiniteQueryContainer";
import UserCard from "./UserCard";

type Props = {
  userId: string;
  currentUserId: string;
};

const Followers = ({ userId, currentUserId }: Props) => {
  const {
    data: users,
    hasNextPage,
    fetchNextPage,
    isPending,
  } = useGetInfiniteUsers({
    followeeId: userId,
    currentUserId: currentUserId,
  });

  return (
    <InfiniteQueryContainer fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}>
      <div className="user-container">
        {isPending ? (
          <Loader />
        ) : users?.pages ? (
          <ul className="user-grid">
            {users.pages.map((page) =>
              page.items.map((follow) => (
                <UserCard
                  key={follow.id}
                  user={follow as unknown as User & { isFollowing?: boolean }}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </ul>
        ) : (
          <p className="text-light-2 mt-4">No users found.</p>
        )}
      </div>
    </InfiniteQueryContainer>
  );
};

export default Followers;
