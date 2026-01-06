import { useGetInfinitePosts } from '@/lib/react-query'
import Loader from '../ui/Loader'
import GridPostList from './GridPostList'
import InfiniteQueryContainer from './InfiniteQueryContainer'

type Props = {
  userId: string
}

const ProfileUserPosts = ({ userId }: Props) => {
  const {
    data: posts,
    isPending,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePosts(userId)

  return (
    <InfiniteQueryContainer
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    >
      {isPending ? (
        <Loader />
      ) : posts && posts.pages ? (
        posts.pages.map((page, index) => (
          <GridPostList
            key={`page-${index}`}
            posts={page.rows}
            showUser={false}
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </InfiniteQueryContainer>
  )
}

export default ProfileUserPosts
