import { Hono } from 'hono';
import { user } from '@/db/auth-schema';
import { db } from '@/db/client';
import { follows, posts } from '@/db/db-schema';
import { getTableColumns, sql, and, eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getCurrentUser } from '../lib/auth';
import type { SuccessResponse } from '../lib/hono';

// Query params schema for pagination
const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});

const usersRouter = new Hono()
    .get(
        '/',
        zValidator('query', paginationSchema),
        async (c) => {
            const { page, limit } = c.req.valid('query');
            const currentUser = await getCurrentUser();
            const currentUserId = currentUser?.id || '';

            const offset = (page - 1) * limit;

            const usersData = await db
                .select({
                    ...getTableColumns(user),
                    isFollowing: sql<boolean>`CASE WHEN ${follows.id} IS NOT NULL THEN true ELSE false END`,
                    postCount: sql<number>`COUNT(${posts.id})`,
                })
                .from(user)
                .leftJoin(posts, eq(posts.creatorId, user.id))
                .leftJoin(follows, and(eq(follows.followeeId, user.id), eq(follows.followerId, currentUserId)))
                .groupBy(user.id, follows.id)
                .orderBy(desc(sql`COUNT(${posts.id})`), desc(user.id))
                .limit(limit + 1)
                .offset(offset);

            const hasMore = usersData.length > limit;
            const items = hasMore ? usersData.slice(0, -1) : usersData;
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

export default usersRouter;

// Export type for RPC client
export type UsersRouter = typeof usersRouter;