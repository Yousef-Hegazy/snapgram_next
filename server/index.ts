import { Hono } from 'hono';
import { createHonoApp } from './lib/hono';
import authRouter from './routes/auth';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';

// Create the main Hono app with error handling
const baseApp = createHonoApp();

// Create the API router
const app = new Hono()
    .basePath('/api')
    .route('/auth', authRouter)
    .route('/posts', postsRouter)
    .route('/users', usersRouter);

// Merge the base app (with error handling) and the routes
const mainApp = baseApp.route('/', app);

export default mainApp;

// Export type for RPC client
export type AppType = typeof app;
