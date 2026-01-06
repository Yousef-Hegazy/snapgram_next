import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { posts, likes, saves, follows } from './db-schema';
import { user, session, account } from './auth-schema';

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export type Like = InferSelectModel<typeof likes>;
export type NewLike = InferInsertModel<typeof likes>;

export type Save = InferSelectModel<typeof saves>;
export type NewSave = InferInsertModel<typeof saves>;

export type Follow = InferSelectModel<typeof follows>;
export type NewFollow = InferInsertModel<typeof follows>;

export type Session = InferSelectModel<typeof session>;

export type Account = InferSelectModel<typeof account>;