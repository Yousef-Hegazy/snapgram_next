"use server";

import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "../db/client";
import { follows } from "../db/db-schema";
import type { Follow } from "../db/schema-types";

export async function toggleFollow(followeeId: string, followerId: string): Promise<Follow | null> {
  const result = await db.transaction(async (tx) => {
    const [existing] = await tx.select().from(follows).where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId))).limit(1);
    if (existing) {
      await tx.delete(follows).where(eq(follows.id, existing.id));
      return null;
    }

    const [created] = await tx.insert(follows).values({ followerId, followeeId }).returning();
    return created;
  });

  updateTag(QUERY_KEYS.GET_USER_BY_ID + followeeId);
  updateTag(QUERY_KEYS.GET_USER_BY_ID + followerId);
  updateTag(QUERY_KEYS.GET_USERS);

  return result;
}

