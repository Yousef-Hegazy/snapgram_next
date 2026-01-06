"use server";

import { and, desc, eq } from "drizzle-orm";
import { user } from "../db/auth-schema";
import { db } from "../db/client";
import { likes, posts, saves } from "../db/db-schema";
import type { Like, Post, Save } from "../db/schema-types";
import { deleteFile, uploadFile } from "../s3/files";

export async function createPost({
  file,
  caption,
  location,
  tags,
  userId,
}: {
  file: File | undefined | null;
  caption: string;
  location?: string;
  tags?: Array<string>;
  userId: string;
}): Promise<Post> {
  // Upload first (S3 is not transactional)
  let uploadedNew: { key: string; url: string } | null = null;
  let imageId = '';
  let imageUrl = '';

  try {
    if (file && file.size > 0) {
      uploadedNew = await uploadFile(file);
      imageId = uploadedNew.key;
      imageUrl = uploadedNew.url;
    }

    const post = await db.transaction(async (tx) => {
      const [created] = await tx.insert(posts).values({
        creatorId: userId,
        caption,
        location: location || null,
        tags: tags || [],
        image_url: imageUrl || '',
        imageId: imageId || '',
      }).returning();

      await tx.insert(likes).values({
        postId: created.id,
        userId,
      });

      return created;
    });

    return post;
  } catch (err) {
    if (uploadedNew?.key) {
      try {
        await deleteFile(uploadedNew.key);
      } catch (delErr) {
        console.error('Failed to delete uploaded file after transaction failure', delErr);
      }
    }
    throw err;
  }
}

export async function editPost({
  id,
  caption,
  location,
  tags,
  file,
  userId,
}: {
  id: string;
  caption: string;
  location?: string;
  tags?: Array<string>;
  file?: File | null;
  userId: string;
}): Promise<Post> {
  const [existing] = await db.select().from(posts).where(eq(posts.id, id));

  if (!existing?.id) throw new Error('Post not found');
  if (existing.creatorId !== userId) throw new Error('You are not authorized to edit this post');

  let imageId = existing.imageId || '';
  let imageUrl = existing.image_url || '';
  let uploadedNew: { key: string; url: string } | null = null;

  try {
    if (file && (file as File).size > 0) {
      uploadedNew = await uploadFile(file as File);
      imageId = uploadedNew.key;
      imageUrl = uploadedNew.url;
    }

    const post = await db.transaction(async (tx) => {
      const [updated] = await tx.update(posts).set({
        caption,
        location: location ?? existing.location,
        tags: tags ?? existing.tags,
        image_url: imageUrl || '',
        imageId: imageId || '',
      }).where(eq(posts.id, id)).returning();

      return updated;
    });

    if (uploadedNew && existing.imageId && uploadedNew.key !== existing.imageId) {
      try {
        await deleteFile(existing.imageId);
      } catch (delErr) {
        console.error('Failed to delete old image after successful update', delErr);
      }
    }

    return post;
  } catch (err) {
    if (uploadedNew) {
      try {
        await deleteFile(uploadedNew.key);
      } catch (delErr) {
        console.error('Failed to delete uploaded image after transaction failure', delErr);
      }
    }
    throw err;
  }
}

export async function deletePost(postId: string, userId: string): Promise<null> {
  const [existing] = await db.select().from(posts).where(eq(posts.id, postId));

  if (!existing?.id) throw new Error('Post not found');
  if (existing.creatorId !== userId) throw new Error('You are not authorized to delete this post');

  try {
    await db.transaction(async (tx) => {
      await tx.delete(posts).where(eq(posts.id, postId));
    });

    if (existing.imageId) {
      try {
        await deleteFile(existing.imageId);
      } catch (delErr) {
        console.error('Failed to delete post image after deletion', delErr);
      }
    }

    return null;
  } catch (err) {
    throw err;
  }
}


export async function toggleLike(postId: string, userId: string): Promise<Like | null> {
  const result = await db.transaction(async (tx) => {
    const [existing] = await tx.select({
      id: likes.id,
      postId: likes.postId,
      userId: likes.userId,
    }).from(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    if (existing) {
      await tx.delete(likes).where(eq(likes.id, existing.id));
      return null;
    }

    const [created] = await tx.insert(likes).values({ postId, userId }).returning();
    return created;
  });

  return result;
}

export async function toggleSave(postId: string, userId: string): Promise<Save | null> {
  const result = await db.transaction(async (tx) => {

    const [existing] = await tx.select().from(saves).where(and(eq(saves.postId, postId), eq(saves.userId, userId)));
    if (existing) {
      await tx.delete(saves).where(eq(saves.id, existing.id));
      return null;
    }

    const [created] = await tx.insert(saves).values({ postId, userId }).returning();
    return created;
  });

  return result;
}

export async function getInfinitePosts({
  page,
  userId,
}: {
  page?: string;
  userId?: string;
}) {
  const limit = 20;
  const pageNum = page && page !== '0' ? Math.max(0, parseInt(page, 10) || 0) : 0;
  const offset = pageNum * limit;

  const rows = await db
    .select({ post: posts, creator: user })
    .from(posts)
    .leftJoin(user, eq(posts.creatorId, user.id))
    .orderBy(desc(posts.updatedAt))
    .limit(limit)
    .offset(offset);

  const postsWithMeta = await Promise.all(
    rows.map(async (r) => {
      const { post, creator } = r;

      let likedByMe = false;
      let savedByMe = false;

      if (userId) {
        const [like] = await db.select().from(likes).where(and(eq(likes.postId, post.id), eq(likes.userId, userId)));
        likedByMe = !!like;

        const [save] = await db.select().from(saves).where(and(eq(saves.postId, post.id), eq(saves.userId, userId)));
        savedByMe = !!save;
      }

      return {
        post,
        creator,
        likedByMe,
        savedByMe,
      };
    }),
  );

  const nextPage = rows.length === limit ? String(pageNum + 1) : null;

  return {
    posts: postsWithMeta,
    nextPage,
  };
}

