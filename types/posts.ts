import type { InferResponseType } from 'hono/client';
import type { postsApi } from '@/lib/hono-client';

// Infer the response type from the posts API
type PostsResponse = InferResponseType<typeof postsApi.$get>;

// Extract the data type from the success response
type PostsData = Extract<PostsResponse, { success: true }>['data'];

// Extract a single post with metadata
export type PostWithMetadata = PostsData['items'][number];

// Export the paginated response type
export type PaginatedPostsResponse = PostsData;

// Creator type extracted from PostWithMetadata
export type PostCreator = PostWithMetadata['creator'];
