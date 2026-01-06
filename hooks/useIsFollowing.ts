import type { Users } from '@/appwrite/types/appwrite'

const useIsFollowing = (currentUserId: string, user?: Users) => {
  if (!user) {
    return { isFollowing: false, isCurrentUser: false }
  }

  const isCurrentUser = user.$id === currentUserId

  const isFollowing =
    !isCurrentUser &&
    user.followersCount &&
    (user.followers || [])?.find((follower) =>
      typeof follower.follower === 'object'
        ? follower.follower.$id === currentUserId
        : String(follower.follower) === currentUserId,
    )

  return { isFollowing: Boolean(isFollowing), isCurrentUser }
}

export default useIsFollowing
