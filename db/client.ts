import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db-schema";
import { env } from "@/env";

export const postgresPool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(postgresPool, { schema });
