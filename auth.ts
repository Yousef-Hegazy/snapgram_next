import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "./db/auth-schema";
import { db } from "./db/client";
import { username } from "better-auth/plugins" // Import the plugin

export const auth = betterAuth({
    database: drizzleAdapter(
        db,
        {
            provider: "pg",
            schema: { user, session, account, verification },
        }
    ),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username()
    ],
    user: {
        additionalFields: {
            username: { type: "string" },
            bio: { type: "string" },
            imageId: { type: "string" },
            imageUrl: { type: "string" },
        }
    },
});