import Loader from '@/components/ui/Loader'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { useEffect } from 'react'

interface InfiniteQueryContainerProps {
  hasNextPage: boolean
  fetchNextPage: () => void
  shouldFetch?: boolean
  children: React.ReactNode
}

export default function InfiniteQueryContainer({
  hasNextPage,
  fetchNextPage,
  shouldFetch = true,
  children,
}: InfiniteQueryContainerProps) {
  const [ref, entry] = useIntersectionObserver({
    root: null,
    threshold: 0,
    rootMargin: '0px',
  })

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && shouldFetch) {
      fetchNextPage()
    }
  }, [entry, hasNextPage, shouldFetch, fetchNextPage])

  return (
    <>
      {children}
      {hasNextPage && shouldFetch && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </>
  )
}
