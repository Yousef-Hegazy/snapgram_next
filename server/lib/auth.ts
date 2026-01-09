import { auth } from '@/auth';
import { DEFAULT_CACHE_DURATION } from '@/lib/constants';
import { QUERY_KEYS } from '@/lib/constants/queryKeys';
import { Context } from 'hono';
import { cacheLife, cacheTag } from 'next/cache';
import { headers } from 'next/headers';
import { ApiError } from './hono';
import { User } from '@/db/schema-types';

/**
 * Get the current session from the request headers
 */
export async function getSession(c: Context) {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    return session;
}

/**
 * Get the current session or throw an error if not authenticated
 */
export async function requireSession(c: Context) {
    const session = await getSession(c);

    if (!session) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    return session;
}


export async function getCurrentUser() {
    "use cache: private";

    cacheTag(QUERY_KEYS.GET_CURRENT_USER);

    cacheLife({
        revalidate: DEFAULT_CACHE_DURATION
    });

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (session?.user || null) as unknown as User | null;
}