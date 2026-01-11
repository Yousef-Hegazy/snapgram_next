"use server";

import { db } from '@/db/client';
import { user as userTable } from '@/db/auth-schema';
import { eq } from 'drizzle-orm';
import { uploadFile, deleteFile } from '@/s3/files';
import { getCurrentUser } from '@/server/lib/auth';
import { updateTag } from 'next/cache';
import { QUERY_KEYS } from '@/lib/constants/queryKeys';
import type { User } from '@/db/schema-types';

export type UpdateUserInput = {
    userId: string;
    name?: string | null;
    bio?: string | null;
    file?: File | null;
};

async function fetchUser(userId: string) {
    const rows = await db.select().from(userTable).where(eq(userTable.id, userId)).limit(1);
    return rows[0] as User | undefined;
}

async function updateUserRow(userId: string, data: Partial<User>) {
    await db.update(userTable).set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.imageId !== undefined ? { imageId: data.imageId } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        updatedAt: new Date(),
    }).where(eq(userTable.id, userId));

    const refreshed = await fetchUser(userId);
    if (!refreshed) throw new Error('Failed to fetch updated user');
    return refreshed;
}

export async function updateUser(input: UpdateUserInput) {
    // Validate current session
    const current = await getCurrentUser();
    if (!current) throw new Error('Unauthorized');
    if (current.id !== input.userId) throw new Error('Unauthorized');

    const dbUser = await fetchUser(input.userId);
    if (!dbUser) throw new Error('User not found');

    const updates: Partial<User> = {};
    if (input.name !== undefined) updates.name = input.name ?? '';
    if (input.bio !== undefined) updates.bio = input.bio ?? null;

    // Handle file upload if provided
    let newImageKey: string | undefined;
    let newImageUrl: string | undefined;

    if (input.file) {
        try {
            const uploaded = await uploadFile(input.file);
            newImageKey = uploaded.key;
            newImageUrl = uploaded.url;

            updates.imageId = newImageKey;
            updates.imageUrl = newImageUrl;
        } catch (err) {
            throw new Error(`Image upload failed: ${String(err)}`);
        }
    }

    // Perform DB update
    let updatedUser: User;
    try {
        updatedUser = await updateUserRow(input.userId, updates);
    } catch (err) {
        // If upload happened but DB update failed, try to cleanup the uploaded image
        if (newImageKey) {
            try { await deleteFile(newImageKey); } catch { /* ignore cleanup errors */ }
        }

        throw err;
    }

    // If we uploaded a new image and there was an old one, attempt to delete old image
    if (newImageKey && dbUser.imageId && dbUser.imageId !== newImageKey) {
        deleteFile(dbUser.imageId).catch(() => { /* non-blocking */ });
    }

    // Update server-side cache tags so all server-rendered data is refreshed

    updateTag(QUERY_KEYS.GET_USERS);
    updateTag(QUERY_KEYS.GET_USER_BY_ID + updatedUser.id);
    updateTag(QUERY_KEYS.GET_CURRENT_USER);


    return updatedUser;
}
