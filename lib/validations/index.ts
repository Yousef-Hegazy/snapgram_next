import * as z from "zod";

export const SignUpValidation = z.object({
    name: z.string().min(2, { error: "Too short" }),
    username: z.string().min(2, { error: "Too short" }),
    email: z.email(),
    password: z.string().min(8, { error: "Password must be at least 8 characters long" })
});

export const SignInValidation = z.object({
    email: z.email(),
    password: z.string().min(8, { error: "Password must be at least 8 characters long" })
});

export const PostValidation = z.object({
    caption: z.string().min(5, { error: "Caption is too short" }).max(2200, { error: "Caption is too long" }),
    file: z.custom<File[]>(),
    location: z.string().min(2, { error: "Location is too short" }).max(100, { error: "Location is too long" }),
    tags: z.string(),
});

export const ProfileUpdateValidation = z.object({
    name: z.string().min(2, { error: "Too short" }),
    username: z.string().min(2, { error: "Too short" }),
    email: z.email().min(2, { error: "Email is too short" }),
    bio: z.string().min(2, { error: "Bio is too short" }),
    file: z.custom<File[]>().optional(),
})