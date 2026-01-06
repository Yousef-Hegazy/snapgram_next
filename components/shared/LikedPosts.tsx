import { useGetInfiniteLikedPosts } from '@/lib/react-query'
import Loader from '../ui/Loader'
import GridPostList from './GridPostList'
import InfiniteQueryContainer from './InfiniteQueryContainer'

type Props = {
  userId: string
}

const LikedPosts = ({ userId }: Props) => {
  const {
    data: posts,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteLikedPosts(userId)

  return (
    <InfiniteQueryContainer
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    >
      {isPending ? (
        <Loader />
      ) : !posts || !posts.pages || isError ? (
        <p>No liked posts found.</p>
      ) : (
        posts.pages.map((page, index) => (
          <GridPostList
            key={`page-${index}`}
            posts={page.rows}
            isLikedPosts={true}
          />
        ))
      )}
    </InfiniteQueryContainer>
  )
}

export default LikedPosts
