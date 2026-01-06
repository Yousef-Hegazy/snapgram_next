import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { QUERY_KEYS } from './queryKeys'

import {
  createPost,
  deletePost,
  editPost,
  getInfinitePosts,
  getPostDetails,
  getPostForEdit,
  getPosts,
  likePost,
  savePost,
  searchPosts,
} from '@/lib/appwrite/postUtils'

import type { INewPost } from '@/types'
import {
  getInfiniteLikedPostsByUser,
  getInfiniteSavedPostsByUser,
} from '../appwrite/usersUtils'

export const useCreatePost = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: INewPost) =>
      createPost({
        file: post.file[0] || null,
        caption: post.caption,
        location: post.location,
        tags: post.tags,
        userId: post.userId,
      }),
    onSuccess: async () => {
      toast.success('Post created successfully')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        type: 'all',
      })
      navigate({
        to: '/',
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post')
    },
  })
}

export const useEditPost = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: INewPost & { id: string }) =>
      editPost({
        id: post.id,
        caption: post.caption,
        location: post.location,
        tags: post.tags,
        file: post.file[0] || undefined,
        userId: post.userId,
      }),
    onSuccess: async () => {
      toast.success('Post updated successfully')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        type: 'all',
      })

      navigate({
        to: '/',
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update post')
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string
      userId: string
    }) => await deletePost(postId, userId),
    onSuccess: async () => {
      toast.success('Post deleted successfully')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        type: 'all',
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete post')
    },
  })
}

export const useGetPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: getPosts,
    refetchOnMount: 'always',
    staleTime: 300_000, // 5 minutes
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      likePost(postId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        type: 'all',
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to like post')
    },
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string
      userId: string
    }) => await savePost(postId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        type: 'all',
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save post')
    },
  })
}

export const useGetPostForEdit = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostForEdit(postId),
    refetchOnMount: 'always',
    staleTime: 300_000, // 5 minutes
  })
}

export const useGetPostDetails = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, postId],
    queryFn: () => getPostDetails(postId),
    refetchOnMount: 'always',
    staleTime: 300_000, // 5 minutes
  })
}

export const useGetInfinitePosts = (userId?: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, QUERY_KEYS.GET_INFINITE_POSTS, userId],
    queryFn: ({ pageParam }) =>
      getInfinitePosts({ page: pageParam, userId: userId }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.rows.length === 0) return null
      // const nextPage = Number(lastPageParam) + 1
      // if (nextPage > allPages.length) return null
      // return nextPage.toString()
      const lastId = lastPage.rows[lastPage.rows.length - 1]?.$id

      return lastId
    },
    initialPageParam: '0',
    refetchOnMount: false,
    staleTime: 300_000, // 5 minutes
  })
}

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, query],
    queryFn: () => searchPosts(query),
    staleTime: 300_000, // 5 minutes
    enabled: !!query,
  })
}

export const useGetInfiniteSaves = (userId: string, limit?: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, userId, 'infinite-saves'],
    queryFn: async ({ pageParam }) =>
      getInfiniteSavedPostsByUser(userId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.rows.length === 0) return null
      const lastId = lastPage.rows[lastPage.rows.length - 1]?.$id
      return lastId
    },
    initialPageParam: '0',
    staleTime: 300_000, // 5 minutes
  })
}

export const useGetInfiniteLikedPosts = (userId: string, limit?: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS, userId, 'infinite-liked'],
    queryFn: async ({ pageParam }) =>
      getInfiniteLikedPostsByUser(userId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.rows.length === 0) return null
      const lastId = lastPage.rows[lastPage.rows.length - 1]?.$id
      return lastId
    },
    initialPageParam: '0',
    refetchOnMount: false,
    staleTime: 300_000, // 5 minutes
  })
}
