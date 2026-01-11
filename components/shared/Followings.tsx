"use client";

import { useGetInfiniteUsers } from '@/lib/react-query'
import Loader from '../ui/Loader'
import FollowingCard from './FollowingCard'
import InfiniteQueryContainer from './InfiniteQueryContainer'

type Props = {
  userId: string
  currentUserId: string;
}

const Followings = ({ userId, currentUserId }: Props) => {
  const {
    data: users,
    isPending,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteUsers({
    followerId: userId,
    currentUserId: currentUserId
  });


  return (
    <InfiniteQueryContainer
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    >
      <div className="user-container w-full">
        {isPending ? (
          <Loader />
        ) : users?.pages ? (
          <ul className="user-grid">
            {users.pages.map((page) =>
              page.items.map((follow) => (
                <FollowingCard
                  key={follow.id}
                  follow={follow}
                  currentUserId={currentUserId}
                />
              )),
            )}
          </ul>
        ) : (
          <p className="text-light-2 mt-4">No users found.</p>
        )}
      </div>
    </InfiniteQueryContainer>
  )
}

export default Followings
