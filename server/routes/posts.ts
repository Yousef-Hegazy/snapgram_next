import { user } from '@/db/auth-schema';
import { db } from '@/db/client';
import { likes, posts, saves } from '@/db/db-schema';
import { zValidator } from '@hono/zod-validator';
import { desc, eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { getSession } from '../lib/auth';
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
            const session = await getSession(c);
            const currentUserId = session?.user?.id;

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
    );
// .post(
//     '/like',
//     zValidator('json', z.object({
//         postId: z.string().uuid(),
//         userId: z.string(),
//     })),
//     async (c) => {
//         const { postId, userId } = c.req.valid('json');
//         const session = await requireSession(c);

//         // Verify the user is the session user
//         if (session.user.id !== userId) {
//             return c.json({ success: false, error: { message: 'Unauthorized', statusCode: 401 } }, 401);
//         }

//         // Check if already liked
//         const existingLike = await db
//             .select()
//             .from(likes)
//             .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
//             .limit(1);

//         if (existingLike.length > 0) {
//             // Unlike: remove the like
//             await db.delete(likes).where(eq(likes.id, existingLike[0].id));
//             return c.json<SuccessResponse<{ liked: boolean }>>({
//                 success: true,
//                 data: { liked: false },
//             });
//         } else {
//             // Like: add the like
//             await db.insert(likes).values({ postId, userId });
//             return c.json<SuccessResponse<{ liked: boolean }>>({
//                 success: true,
//                 data: { liked: true },
//             });
//         }
//     }
// )
// .post(
//     '/save',
//     zValidator('json', z.object({
//         postId: z.string().uuid(),
//         userId: z.string(),
//     })),
//     async (c) => {
//         const { postId, userId } = c.req.valid('json');
//         const session = await requireSession(c);

//         // Verify the user is the session user
//         if (session.user.id !== userId) {
//             return c.json({ success: false, error: { message: 'Unauthorized', statusCode: 401 } }, 401);
//         }

//         // Check if already saved
//         const existingSave = await db
//             .select()
//             .from(saves)
//             .where(and(eq(saves.postId, postId), eq(saves.userId, userId)))
//             .limit(1);

//         if (existingSave.length > 0) {
//             // Unsave: remove the save
//             await db.delete(saves).where(eq(saves.id, existingSave[0].id));
//             return c.json<SuccessResponse<{ saved: boolean }>>({
//                 success: true,
//                 data: { saved: false },
//             });
//         } else {
//             // Save: add the save
//             await db.insert(saves).values({ postId, userId });
//             return c.json<SuccessResponse<{ saved: boolean }>>({
//                 success: true,
//                 data: { saved: true },
//             });
//         }
//     }
// )

export default postsRouter;

// Export type for RPC client
export type PostsRouter = typeof postsRouter;
