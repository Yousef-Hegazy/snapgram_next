import { createPost, editPost, toggleLikePost, toggleSavePost } from '@/actions/posts'
import { postsApi } from '@/lib/hono-client'
import { INewPost } from '@/types'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { QUERY_KEYS } from '../constants/queryKeys'

export const useCreatePost = () => {
    const router = useRouter()
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
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
                type: 'all',
            })
            toast.success('Post created successfully')
            router.replace("/posts")
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create post')
        },
    })
}

export const useEditPost = () => {
    const router = useRouter()
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
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
                type: 'all',
            })

            toast.success('Post updated successfully')

            router.replace("/posts")
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update post')
        },
    })
}

/**
 * Hook to fetch paginated posts using Hono RPC client
 */
export const useGetInfinitePosts = (limit: number = 10, currentUserId: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_POSTS, QUERY_KEYS.GET_INFINITE_POSTS, limit, currentUserId],
        queryFn: async ({ pageParam }) => {
            const response = await postsApi.$get({
                query: {
                    page: pageParam.toString(),
                    limit: limit.toString(),
                },
            });

            const json = await response.json();

            if (!json.success) {
                const errorJson = json as unknown as { success: false; error: { message: string } };
                throw new Error(errorJson.error.message || 'Failed to fetch posts');
            }

            return json.data;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasMore) return undefined;
            return lastPage.nextPage ?? undefined;
        },
        initialPageParam: 1,
        staleTime: 300_000, // 5 minutes
    });
}

/**
 * Hook to fetch paginated saved posts using Hono RPC client
 */
export const useGetInfiniteSavedPosts = (limit: number = 10, currentUserId: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_POSTS, QUERY_KEYS.GET_SAVED_POSTS, QUERY_KEYS.GET_INFINITE_POSTS, limit, currentUserId],
        queryFn: async ({ pageParam }) => {
            const response = await postsApi.saved.$get({
                query: {
                    page: pageParam.toString(),
                    limit: limit.toString(),
                },
            });

            const json = await response.json();

            if (!json.success) {
                const errorJson = json as unknown as { success: false; error: { message: string } };
                throw new Error(errorJson.error.message || 'Failed to fetch saved posts');
            }

            return json.data;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasMore) return undefined;
            return lastPage.nextPage ?? undefined;
        },
        initialPageParam: 1,
        staleTime: 300_000, // 5 minutes
    });
}

/**
 * Hook to like/unlike a post
 */
export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => toggleLikePost(postId, userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
                type: 'all',
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to like post');
        },
    });
};

/**
 * Hook to save/unsave a post
 */
export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => toggleSavePost(postId, userId),
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
                type: 'all',
            });
            toast.success(res?.id ? 'Post saved' : 'Post unsaved');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save post');
        },
    });
};