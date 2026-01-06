import type { Follows } from '@/appwrite/types/appwrite'
import { useUnfollow } from '@/lib/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import Loader from '../ui/Loader'

type Props = {
  follow: Follows
  currentUserId: string
}

const FollowingCard = ({ follow, currentUserId }: Props) => {
  const user = follow.followee

  const { mutate: unfollow, isPending: isUnfollowing } = useUnfollow()

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    unfollow({
      followId: follow.$id,
      userId: user.$id,
      followerId: currentUserId,
    })
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

      <Button
        onClick={handleFollow}
        type="button"
        size="sm"
        className="px-5 shad-button_dark_4"
      >
        {isUnfollowing ? <Loader /> : 'Unfollow'}
      </Button>
    </Link>
  )
}

export default FollowingCard
