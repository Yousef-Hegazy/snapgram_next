import type { Users } from '@/appwrite/types/appwrite'
import useIsFollowing from '@/hooks/useIsFollowing'
import { useToggleFollowUser } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import Loader from '../ui/Loader'

type Props = {
  user: Users
  currentUserId: string
}

const UserCard = ({ user, currentUserId }: Props) => {
  const { isFollowing, isCurrentUser } = useIsFollowing(currentUserId, user)

  const { mutate: toggleFollow, isPending: isTogglingFollow } =
    useToggleFollowUser()

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    toggleFollow({ userId: user.$id, followerId: currentUserId })
  }

  return (
    <Link to="/profile/$id" params={{ id: user.$id }} className="user-card">
      <img
        src={user.imageUrl}
        alt={user.name}
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>

        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      {isCurrentUser ? (
        <Button
          type="button"
          size="sm"
          className="shad-button_dark_4 px-5 pointer-events-none"
        >
          You
        </Button>
      ) : (
        <Button
          onClick={handleFollow}
          type="button"
          size="sm"
          className={cn('px-5', {
            'shad-button_primary': !isFollowing,
            'shad-button_dark_4': isFollowing,
          })}
        >
          {isTogglingFollow ? <Loader /> : isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </Link>
  )
}

export default UserCard
