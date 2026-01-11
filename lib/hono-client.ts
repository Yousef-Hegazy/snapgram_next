import { hc } from 'hono/client';
import type { AppType } from '@/server';

// Create the Hono RPC client
// In development, use relative URL; in production, use absolute URL
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Browser: infer base URL from the current location so we don't need an env var
        // This makes the client work on any host (dev or prod) without manual config
        return window.location.origin;
    }

    return "";
};

export const client = hc<AppType>(getBaseUrl());

// Export the API client for posts
export const postsApi = client.api.posts;
export const usersApi = client.api.users;
