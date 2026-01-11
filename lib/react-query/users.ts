import { toggleFollow } from "@/actions/follows"
import { usersApi } from "@/lib/hono-client"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { DEFAULT_CACHE_DURATION } from "../constants"
import { QUERY_KEYS } from "../constants/queryKeys"
import { updateUser, type UpdateUserInput } from '@/actions/users'
import type { User } from '@/db/schema-types'

export const useToggleFollowUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
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
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to toggle follow user')
        },
    });
}

/**
 * Hook to fetch paginated users using Hono RPC client
 */
export const useGetInfiniteUsers = ({ limit = 10, currentUserId, followerId, followeeId }: { limit?: number, currentUserId?: string; followerId?: string; followeeId?: string }) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_USERS, QUERY_KEYS.GET_INFINITE_USERS, limit, currentUserId, followerId, followeeId],
        queryFn: async ({ pageParam }) => {
            const response = await usersApi.$get({
                query: {
                    page: pageParam.toString(),
                    limit: limit.toString(),
                    followerId,
                    followeeId
                },
            });

            const json = await response.json();

            if (!json.success) {
                const errorJson = json as unknown as { success: false; error: { message: string } };
                throw new Error(errorJson.error.message || 'Failed to fetch users');
            }

            return json.data;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasMore) return undefined;
            return lastPage.nextPage ?? undefined;
        },
        initialPageParam: 1,
        staleTime: DEFAULT_CACHE_DURATION, // 5 minutes
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, UpdateUserInput>({
        mutationFn: async (input: UpdateUserInput) => {
            return await updateUser(input);
        },
        onSuccess: async (updatedUser) => {
            // Invalidate lists and user-specific queries
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USERS], type: 'all', refetchType: 'active' });

            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_BY_ID, updatedUser.id] });

            toast.success('Profile updated');
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message || 'Failed to update profile');
        },
    });
}
