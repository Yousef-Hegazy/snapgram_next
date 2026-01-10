import { user } from '@/db/auth-schema';
import { db } from '@/db/client';
import { likes, posts, saves } from '@/db/db-schema';
import { zValidator } from '@hono/zod-validator';
import { desc, eq, sql, and } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { getCurrentUser } from '../lib/auth';
import type { SuccessResponse } from '../lib/hono';

// Query params schema for pagination
const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});

// Create the posts router
const postsRouter = new Hono()
    .get(
        '/',
        zValidator('query', paginationSchema),
        async (c) => {
            const { page, limit } = c.req.valid('query');
            const currentUser = await getCurrentUser();
            const currentUserId = currentUser?.id || "";

            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Fetch posts with creator details
            const postsData = await db
                .select({
                    id: posts.id,
                    caption: posts.caption,
                    tags: posts.tags,
                    imageUrl: posts.imageUrl,
                    imageId: posts.imageId,
                    location: posts.location,
                    createdAt: posts.createdAt,
                    updatedAt: posts.updatedAt,
                    creatorId: posts.creatorId,
                    creator: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        imageUrl: user.imageUrl,
                        bio: user.bio,
                    },
                    likesCount: sql<number>`(
                        SELECT COUNT(*)::int FROM ${likes} 
                        WHERE ${likes.postId} = ${posts.id}
                    )`,
                    savesCount: sql<number>`(
                        SELECT COUNT(*)::int FROM ${saves} 
                        WHERE ${saves.postId} = ${posts.id}
                    )`,
                    isLikedByUser: currentUserId
                        ? sql<boolean>`EXISTS(
                            SELECT 1 FROM ${likes} 
                            WHERE ${likes.postId} = ${posts.id} 
                            AND ${likes.userId} = ${currentUserId}
                        )`
                        : sql<boolean>`false`,
                    isSavedByUser: currentUserId
                        ? sql<boolean>`EXISTS(
                            SELECT 1 FROM ${saves} 
                            WHERE ${saves.postId} = ${posts.id} 
                            AND ${saves.userId} = ${currentUserId}
                        )`
                        : sql<boolean>`false`,
                })
                .from(posts)
                .leftJoin(user, eq(posts.creatorId, user.id))
                .orderBy(desc(posts.createdAt), desc(posts.id))
                .limit(limit + 1)
                .offset(offset);

            // Check if there are more posts
            const hasMore = postsData.length > limit;
            const items = hasMore ? postsData.slice(0, -1) : postsData;

            // Get the next page number
            const nextPage = hasMore ? page + 1 : null;

            return c.json<SuccessResponse<{
                items: typeof items;
                nextPage: number | null;
                hasMore: boolean;
            }>>({
                success: true,
                data: {
                    items,
                    nextPage,
                    hasMore,
                },
            });
        }
    )
    .get(
        '/saved',
        zValidator('query', paginationSchema),
        async (c) => {
            const { page, limit } = c.req.valid('query');
            const currentUser = await getCurrentUser();
            const currentUserId = currentUser?.id || "";

            if (!currentUserId) {
                return c.json({ success: false, error: { message: 'Unauthorized', statusCode: 401 } }, 401);
            }

            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Fetch saved posts with creator details
            const postsData = await db
                .select({
                    id: posts.id,
                    caption: posts.caption,
                    tags: posts.tags,
                    imageUrl: posts.imageUrl,
                    imageId: posts.imageId,
                    location: posts.location,
                    createdAt: posts.createdAt,
                    updatedAt: posts.updatedAt,
                    creatorId: posts.creatorId,
                    creator: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        imageUrl: user.imageUrl,
                        bio: user.bio,
                    },
                    likesCount: sql<number>`(
                        SELECT COUNT(*)::int FROM ${likes} 
                        WHERE ${likes.postId} = ${posts.id}
                    )`,
                    savesCount: sql<number>`(
                        SELECT COUNT(*)::int FROM ${saves} 
                        WHERE ${saves.postId} = ${posts.id}
                    )`,
                    isLikedByUser: sql<boolean>`EXISTS(
                        SELECT 1 FROM ${likes} 
                        WHERE ${likes.postId} = ${posts.id} 
                        AND ${likes.userId} = ${currentUserId}
                    )`,
                    isSavedByUser: sql<boolean>`true`, // Since we're fetching saved posts
                })
                .from(posts)
                .innerJoin(saves, and(eq(saves.postId, posts.id), eq(saves.userId, currentUserId)))
                .leftJoin(user, eq(posts.creatorId, user.id))
                .orderBy(desc(posts.createdAt), desc(posts.id))
                .limit(limit + 1)
                .offset(offset);

            // Check if there are more posts
            const hasMore = postsData.length > limit;
            const items = hasMore ? postsData.slice(0, -1) : postsData;

            // Get the next page number
            const nextPage = hasMore ? page + 1 : null;

            return c.json<SuccessResponse<{
                items: typeof items;
                nextPage: number | null;
                hasMore: boolean;
            }>>({
                success: true,
                data: {
                    items,
                    nextPage,
                    hasMore,
                },
            });
        }
    );

export default postsRouter;

// Export type for RPC client
export type PostsRouter = typeof postsRouter;
