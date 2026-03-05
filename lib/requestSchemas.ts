import { Privacy } from "@/app/generated/prisma/enums";
import z from "zod";

export const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    username: z.string().trim().min(3).max(20)
});

export const signInSchema = signUpSchema.omit({ username: true });

export const usernameSchema = z.object({
    username: z.string().trim().min(3).max(20)
})

export const bioSchema = z.object({
    bio: z.string().trim().max(500)
});

export const privacySchema = z.object({
    privacy: z.enum(Privacy)
});

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 5_000_000, "Max 5MB")
    .refine((file) => file.type.startsWith("image/") || file.type.startsWith("video/"), "Must be an image or video");

export const postSchema = z.object({
    content: z.string().max(1000),
    media: z.array(fileSchema),
});

export const targetSchema = z.object({
    targetId: z.string()
});

export const commentSchema = z.object({
    content: z.string().min(1).max(1000),
    media: fileSchema.optional(),
    postId: z.string(),
    parentId: z.string().optional(),
});

export const messageSchema = postSchema.extend({
    recipientId: z.string(),
    isChat: z.boolean(),
});