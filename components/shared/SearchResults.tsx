import type { Posts } from '@/appwrite/types/appwrite'
import Loader from '../ui/Loader'
import GridPostList from './GridPostList'

type Props = {
  isLoading: boolean
  posts: Posts[]
}

const SearchResults = ({ isLoading, posts }: Props) => {
  if (isLoading) {
    return <Loader />
  }

  if (posts.length > 0) {
    return <GridPostList posts={posts}  />
  }

  return <p className='text-light-4 mt-10 text-center w-full'>No results found.</p>
}

export default SearchResults
