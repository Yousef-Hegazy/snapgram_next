import { useAuthContext } from '@/context/AuthContext'
import { useGetInfiniteFollowings } from '@/lib/react-query'
import Loader from '../ui/Loader'
import FollowingCard from './FollowingCard'
import InfiniteQueryContainer from './InfiniteQueryContainer'

type Props = {
  userId: string
}

const Followings = ({ userId }: Props) => {
  const { user } = useAuthContext()
  const {
    data: users,
    isPending,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteFollowings(userId)

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
              page.rows.map((follow) => (
                <FollowingCard
                  key={follow.$id}
                  follow={follow}
                  currentUserId={user.id}
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
