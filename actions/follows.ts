"use server";

import { and, eq } from "drizzle-orm";
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

  return result;
}

