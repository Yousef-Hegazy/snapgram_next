import { User as DrizzleUser } from "../db/schema-types";

declare module "better-auth" {
    // We intersection the base User with your DrizzleUser
    // This often works better than 'extends' for intellisense refresh
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends DrizzleUser {}
    
    // Also extend the Session user specifically
    interface Session {
        user: DrizzleUser;
    }
}