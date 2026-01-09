import { Hono } from 'hono';
import { auth } from '@/auth';

// Create the auth router that handles all better-auth routes
const authRouter = new Hono()
    .all('/*', async (c) => {
        // Pass the request to better-auth handler
        return auth.handler(c.req.raw);
    });

export default authRouter;

export type AuthRouter = typeof authRouter;
