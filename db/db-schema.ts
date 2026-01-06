import {
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';



/**
 * Posts
 */
export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    creatorId: text('creator_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    caption: text('caption'),
    tags: text('tags').array(),
    imageUrl: text('image_url').notNull(),
    imageId: text('image_id').notNull(),
    location: text('location'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('post_image_id_idx').on(table.imageId),
]);

/**
 * Likes
 */
export const likes = pgTable(
    'likes',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
        userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('likes_user_post_idx').on(table.userId, table.postId),
    ]
);

/**
 * Saves
 */
export const saves = pgTable(
    'saves',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
        userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('saves_user_post_idx').on(table.userId, table.postId),
    ]
);

/**
 * Follows
 */
export const follows = pgTable(
    'follows',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        followerId: text('follower_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
        followeeId: text('followee_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('follows_follower_followee_idx').on(table.followerId, table.followeeId),
    ]
);
