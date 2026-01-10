import { hc } from 'hono/client';
import type { AppType } from '@/server';

// Create the Hono RPC client
// In development, use relative URL; in production, use absolute URL
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Browser should use relative path
        return '';
    }

    // SSR should use absolute URL
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const client = hc<AppType>(getBaseUrl());

// Export the API client for posts
export const postsApi = client.api.posts;
export const usersApi = client.api.users;
