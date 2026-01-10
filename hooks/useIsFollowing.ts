import type { User } from '@/db/schema-types'

const useIsFollowing = (currentUserId: string, user?: User & { isFollowing?: boolean }) => {
  if (!user) {
    return { isFollowing: false, isCurrentUser: false }
  }

  const isCurrentUser = user.id === currentUserId

  const isFollowing = user.isFollowing ?? false

  return { isFollowing, isCurrentUser }
}

export default useIsFollowing
