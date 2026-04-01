"use server"

import { postSchema, targetSchema } from "@/lib/requestSchemas"
import { FollowStatus, MediaType, Privacy, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { AuthenticatedAction, ValidatedActionWithAuth } from "../util/Middleware"
import { processMedia } from "../util/Cloudinary"
import { canAccessPost, postConfig, postDataIncludes } from "./helpers"

export async function createPostAction(content: string, media: File[]) {
    return await ValidatedActionWithAuth(postSchema, { content, media }, createPost);
}

export async function deletePostAction(postId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: postId }, deletePost);
}

export async function likePostAction(postId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: postId }, likePost);
}

export async function unlikePostAction(postId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: postId }, unlikePost);
}

export async function getFeedAction() {
    return await AuthenticatedAction(getFeed);
}

async function createPost(user: User, args: z.infer<typeof postSchema>) {
    try {
        let uploadedMedia: { url: string; type: MediaType }[] = [];

        if (args?.media?.length > 0) {
            uploadedMedia = await Promise.all(args.media.map(processMedia));
        }

        const post = await prisma.post.create({
            data: {
                content: args.content,
                authorId: user.id,
                media: uploadedMedia ? { create: uploadedMedia } : undefined
            }, include: postDataIncludes
        });

        return { success: true, post };
    } catch (error) {
        console.error("Create post failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create post"
        };
    }
}

async function deletePost(user: User, args: z.infer<typeof targetSchema>) {
    await prisma.post.delete({
        where: {
            id: args.targetId,
            authorId: user.id
        }
    });
}

async function likePost(user: User, args: z.infer<typeof targetSchema>) {
    const post = await prisma.post.findFirst({
        where: { ...canAccessPost(user), id: args.targetId }
    });

    if (!post) {
        throw new Error("Post not found or access denied");
    }

    await prisma.like.create({
        data: {
            postId: args.targetId,
            userId: user.id
        }
    });
}

async function unlikePost(user: User, args: z.infer<typeof targetSchema>) {
    const post = await prisma.post.findFirst({
        where: { ...canAccessPost(user), id: args.targetId }
    });

    if (!post) {
        throw new Error("Post not found or access denied");
    }

    await prisma.like.delete({
        where: {
            userId_postId: {
                userId: user.id,
                postId: args.targetId,
            },
        },
    });
}

async function getFeed(user: User) {
    return await prisma.post.findMany({ ...postConfig(user) , orderBy: { createdAt: "desc" } });
}