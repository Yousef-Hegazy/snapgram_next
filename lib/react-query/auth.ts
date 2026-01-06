import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AppwriteException } from 'appwrite'
import { toast } from 'sonner'

import { QUERY_KEYS } from './queryKeys'

import {
  createUserAccount,
  getCurrentUser,
  logout,
  signInAccount,
} from '@/lib/appwrite/authUtils'

import { INITIAL_USER, useAuthContext } from '@/context/AuthContext'
import type { IUser } from '@/types'

export const useCreateUserAccount = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setIsAuthenticated } = useAuthContext()
  return useMutation({
    mutationFn: createUserAccount,
    onSuccess: (data) => {
      const user: IUser = {
        id: data.$id,
        name: data.name,
        username: data.username || '',
        email: data.email,
        imageUrl: data.imageUrl,
        bio: data.bio || '',
        followeesCount: data.followeesCount || 0,
        followersCount: data.followersCount || 0,
        postCount: data.postCount || 0,
      }
      setUser(user)

      setIsAuthenticated(true)

      queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], data, {
        updatedAt: Date.now(),
      })

      navigate({
        to: '/posts',
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })
}

export const useSignInAccount = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setIsAuthenticated } = useAuthContext()

  return useMutation({
    mutationFn: signInAccount,
    onSuccess: (data) => {
      const user: IUser = {
        id: data.$id,
        name: data.name,
        username: data.username || '',
        email: data.email,
        imageUrl: data.imageUrl,
        bio: data.bio || '',
        followeesCount: data.followeesCount || 0,
        followersCount: data.followersCount || 0,
        postCount: data.postCount || 0,
      }
      setUser(user)

      setIsAuthenticated(true)

      queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], data, {
        updatedAt: Date.now(),
      })

      navigate({
        to: '/posts',
        replace: true,
      })
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        toast.error(error.message)
        return
      }
      toast.error(
        error.message || 'Failed to sign in, please try again or contact us.',
      )
    },
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
    staleTime: 300_000, // 5 minutes
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setIsAuthenticated } = useAuthContext()
  return useMutation({
    mutationFn: async () => {
      await logout()
    },
    onSuccess: async () => {
      navigate({
        to: '/sign-in',
        replace: true,
      })

      setUser(INITIAL_USER)
      setIsAuthenticated(false)

      queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], null, {
        updatedAt: Date.now(),
      })
    },
  })
}
