"use server";

import { revalidateTag, updateTag } from "next/cache";

export async function updateCacheTag(tag: string) {
    updateTag(tag);
}

export async function revalidateCacheTag(props: Parameters<typeof revalidateTag>) {
    revalidateTag(...props);
}