import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { revalidateCacheTag } from '@/actions/common'
import { authClient } from '@/auth-client'
import { useRouter } from 'next/navigation'
import { QUERY_KEYS } from '../constants/queryKeys'
import { SignUpValidationType } from '../validations'

export const useCreateUserAccount = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (data: SignUpValidationType) => {
      const res = await authClient.signUp.email({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res.data;
    },
    onSuccess: async () => {
      await revalidateCacheTag([QUERY_KEYS.GET_CURRENT_USER, "max"]);

      router.push('/posts')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })
}

export const useSignInAccount = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res.data;
    },
    onSuccess: async () => {
      await revalidateCacheTag([QUERY_KEYS.GET_CURRENT_USER, "max"]);
      router.push('/posts')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to sign in')
    },
  })
}

export const useLogout = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      await revalidateCacheTag([QUERY_KEYS.GET_CURRENT_USER, "max"]);
      router.push('/sign-in')
    },
  })
}
