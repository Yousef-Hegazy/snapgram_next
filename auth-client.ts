import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    // fetchOptions: {
    //     cache: "force-cache",
    //     next: { tags: ["auth"], revalidate: 50 }
    // }
})