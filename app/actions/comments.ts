"use server"

import { commentSchema, targetSchema } from "@/lib/requestSchemas"
import { FollowStatus, MediaType, Privacy, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { ValidatedActionWithAuth } from "../util/Middleware"
import { processMedia } from "../util/Cloudinary"
import { canAccessPost } from "./helpers"

export async function createCommentAction(content: string, postId: string) {
    return await ValidatedActionWithAuth(commentSchema, { content, postId }, createComment);
}

export async function deleteCommentAction(commentId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: commentId }, deleteComment);
}

export async function getCommentsForPostAction(postId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: postId }, getCommentsForPost);
}

async function createComment(user: User, args: z.infer<typeof commentSchema>) {
    try {
        const post = await prisma.post.findFirst({
            where: { ...canAccessPost(user), id: args.postId }
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const comment = await prisma.comment.create({
            data: {
                content: args.content,
                postId: args.postId,
                authorId: user.id,
            },
            include: {
                author: true
            }
        });

        return comment;
    } catch (error) {
        console.error("Create comment failed:", error);
        throw new Error("Failed to create comment");
    }
}

async function deleteComment(user: User, args: z.infer<typeof targetSchema>) {
    await prisma.comment.delete({
        where: {
            id: args.targetId,
            authorId: user.id
        }
    });
}

async function getCommentsForPost(user: User, args: z.infer<typeof targetSchema>) {
    const postId = args.targetId

    const post = await prisma.post.findFirst({
        where: { ...canAccessPost(user), id: args.targetId }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId,
        },
        include: {
            author: true
        }
        , orderBy: {
            createdAt: "desc"
        }
    })

    return comments;
}