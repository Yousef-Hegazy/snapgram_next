import { useAuthContext } from '@/context/AuthContext'
import { useGetInfiniteFollowers } from '@/lib/react-query'
import Loader from '../ui/Loader'
import InfiniteQueryContainer from './InfiniteQueryContainer'
import UserCard from './UserCard'

type Props = {
  userId: string
}

const Followers = ({ userId }: Props) => {
  const { user: currentUser } = useAuthContext()
  const {
    data: users,
    hasNextPage,
    fetchNextPage,
    isPending,
  } = useGetInfiniteFollowers(userId)

  return (
    <InfiniteQueryContainer
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    >
      <div className="user-container">
        {isPending ? (
          <Loader />
        ) : users?.pages ? (
          <ul className="user-grid">
            {users.pages.map((page) =>
              page.rows.map((follow) => (
                <UserCard
                  key={follow.$id}
                  user={follow.follower}
                  currentUserId={currentUser.id}
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

export default Followers
