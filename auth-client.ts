import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
// const getBaseUrl = () => {
//     if (typeof window !== 'undefined') {
//         // Browser should use relative path
//         return '/api/auth';
//     }
//     // SSR should use full URL
//     return process.env.NEXTAUTH_URL || 'http://localhost:3000/api/auth';
// };

export const authClient = createAuthClient({
    plugins: [
        usernameClient()
    ],
    $InferAuth: {
        user: {
            additionalFields: {
                username: { type: "string" },
                bio: { type: "string" },
                imageId: { type: "string" },
                imageUrl: { type: "string" },
            }
        }
    }
})