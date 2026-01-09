import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Custom API Error class for standardized error handling
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Standard error response type
 */
export type ErrorResponse = {
    success: false;
    error: {
        message: string;
        code?: string;
        statusCode: number;
    };
};

/**
 * Standard success response type
 */
export type SuccessResponse<T> = {
    success: true;
    data: T;
};

/**
 * Create a new Hono app with global error handling
 */
export function createHonoApp() {
    const app = new Hono();

    // Global error handler
    app.onError((err, c) => {
        console.error('API Error:', err);

        // Handle custom ApiError
        if (err instanceof ApiError) {
            return c.json<ErrorResponse>(
                {
                    success: false,
                    error: {
                        message: err.message,
                        code: err.code,
                        statusCode: err.statusCode,
                    },
                },
                err.statusCode as 400 | 401 | 403 | 404 | 500
            );
        }

        // Handle Hono HTTPException
        if (err instanceof HTTPException) {
            return c.json<ErrorResponse>(
                {
                    success: false,
                    error: {
                        message: err.message,
                        statusCode: err.status,
                    },
                },
                err.status
            );
        }

        // Handle unknown errors
        return c.json<ErrorResponse>(
            {
                success: false,
                error: {
                    message: process.env.NODE_ENV === 'production'
                        ? 'Internal Server Error'
                        : err.message || 'Internal Server Error',
                    statusCode: 500,
                },
            },
            500
        );
    });

    // Not found handler
    app.notFound((c) => {
        return c.json<ErrorResponse>(
            {
                success: false,
                error: {
                    message: 'Not Found',
                    statusCode: 404,
                },
            },
            404
        );
    });

    return app;
}
