import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { QUERY_KEYS } from './queryKeys'

import { useAuthContext } from '@/context/AuthContext'
import type { IUpdateUser } from '@/types'
import {
  getInfiniteFollowers,
  getInfiniteFollowings,
  getInfiniteUsers,
  getUserById,
  getUserForEdit,
  getUsers,
  removeFollow,
  toggleFollow,
  updateUser,
} from '../appwrite/usersUtils'
import { useNavigate } from '@tanstack/react-router'

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
    refetchOnMount: 'always',
    staleTime: 300_000, // 5 minutes
  })
}

export const useInfiniteUsers = (limit?: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS, 'infinite'],
    queryFn: ({ pageParam }) => getInfiniteUsers(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.rows.length === 0) return null
      const lastId = lastPage.rows[lastPage.rows.length - 1]?.$id
      return lastId
    },
    initialPageParam: '0',
    staleTime: 300_000, // 5 minutes
  })
}

export const useToggleFollowUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      followerId,
    }: {
      userId: string
      followerId: string
    }) => toggleFollow(userId, followerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
        type: 'all',
        refetchType: 'active',
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
        refetchType: 'active',
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to toggle follow user')
    },
  })
}

export const useUnfollow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      followId,
      userId,
      followerId,
    }: {
      followId: string
      userId: string
      followerId: string
    }) => removeFollow(followId, userId, followerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
        type: 'all',
        refetchType: 'active',
      })

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
        refetchType: 'active',
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to toggle follow user')
    },
  })
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    staleTime: 300_000, // 5 minutes
    refetchOnMount: 'always',
  })
}

export const useGetUserForEdit = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId, 'for-edit'],
    queryFn: () => getUserForEdit(userId),
    staleTime: 300_000, // 5 minutes
    refetchOnMount: 'always',
  })
}

export const useGetInfiniteFollowers = (userId: string, limit?: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS, userId, 'infinite-followers'],
    queryFn: async ({ pageParam }) =>
      getInfiniteFollowers(userId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.rows.length === 0) return null
      const lastId = lastPage.rows[lastPage.rows.length - 1]?.$id
      return lastId
    },
    initialPageParam: '0',
    staleTime: 300_000, // 5 minutes
  })
}

export const useGetInfiniteFollowings = (userId: string, limit?: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS, userId, 'infinite-followings'],
    queryFn: async ({ pageParam }) =>
      getInfiniteFollowings(userId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.rows.length === 0) return null
      const lastId = lastPage.rows[lastPage.rows.length - 1]?.$id
      return lastId
    },
    initialPageParam: '0',
    staleTime: 300_000, // 5 minutes
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthContext()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: IUpdateUser) => updateUser(data),
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile')
    },
    onSuccess: async (data) => {
      setUser({
        id: data.$id,
        bio: data.bio || '',
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl,
        followeesCount: data.followeesCount || 0,
        followersCount: data.followersCount || 0,
        username: data.username || '',
        postCount: data.postCount || 0,
      })

      queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], data)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data.$id],
        refetchType: 'active',
      })

      navigate({
        to: '/profile/$id',
        params: { id: data.$id },
      })
    },
  })
}
