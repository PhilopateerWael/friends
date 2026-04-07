import { Privacy } from "@/app/generated/prisma/enums";
import z from "zod";

const nameSchema = z.string().trim().min(3).max(20)

export const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: nameSchema
});

export const signInSchema = signUpSchema.omit({ name: true });

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 5_000_000, "Max 5MB")
    .refine((file) => file.type.startsWith("image/") || file.type.startsWith("video/"), "Must be an image or video");

const imageSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 5_000_000, "Max 5MB")
    .refine((file) => file.type.startsWith("image/") , "Must be an image");

export const postSchema = z.object({
    content: z.string().max(1000),
    media: z.array(fileSchema),
});

export const targetSchema = z.object({
    targetId: z.string()
});

export const commentSchema = z.object({
    content: z.string().min(1).max(1000),
    postId: z.string(),
});

export const messageSchema = postSchema.extend({
    chatId: z.string(),
});

export const editProfileSchema = z.object({
    name: nameSchema,
    bio: z.string().max(160).optional(),
    image : imageSchema.optional().nullable(),
    privacy : z.enum(Privacy).optional()
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
});