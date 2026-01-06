import type { Likes, Posts, Saves } from '@/appwrite/types/appwrite'
import { useAuthContext } from '@/context/AuthContext'
import { Link } from '@tanstack/react-router'
import { PostStats } from './PostCard/PostStats'

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
  isLikedPosts = false,
  isSavedPosts = false,
}: {
  posts: Posts[] | Saves[] | Likes[]
  showUser?: boolean
  showStats?: boolean
  isLikedPosts?: boolean
  isSavedPosts?: boolean
}) => {
  const { user } = useAuthContext()

  return (
    <ul className="grid-container">
      {posts.map((postOrSave) => {
        let post
        if ('post' in postOrSave) {
          post = postOrSave.post
        } else {
          post = postOrSave
        }

        return (
          <li key={post.$id} className="relative min-w-80 h-80">
            <Link
              to="/posts/$id"
              params={{ id: post.$id }}
              className="grid-post_link"
            >
              <img
                src={post.imageUrl}
                alt={post.caption || 'post'}
                className="object-cover w-full h-full"
              />
            </Link>

            <div className="grid-post_user">
              {showUser ? (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={post.creator.imageUrl}
                    alt="creator"
                    className="size-8 rounded-full"
                  />

                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              ) : null}

              {showStats ? (
                <PostStats
                  post={post}
                  userId={user.id}
                  isLikedPosts={isLikedPosts}
                  isSavedPosts={isSavedPosts}
                />
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default GridPostList
