"use server"

import { commentSchema, targetSchema } from "@/lib/requestSchemas"
import { MediaType, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { ValidatedActionWithAuth } from "../util/Middleware"
import { processMedia } from "../util/Cloudinary"

export async function createCommentAction(content: string, postId: string, media?: File, parentId?: string) {
    ValidatedActionWithAuth(commentSchema, { content, media, postId, parentId }, createComment);
}

export async function deleteCommentAction(commentId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: commentId }, deleteComment);
}

export async function likeCommentAction(commentId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: commentId }, likeComment);
}

export async function unlikeCommentAction(commentId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: commentId }, unlikeComment);
}

async function createComment(user: User, args: z.infer<typeof commentSchema>) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: args.postId
            }
        });

        if (!post) {
            throw new Error("Post not found");
        }

        if (args.parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: {
                    id: args.parentId
                }
            });

            if (!parentComment) {
                throw new Error("Parent comment not found");
            }

            if (parentComment.postId !== args.postId) {
                throw new Error("Parent comment does not belong to the same post");
            }
        }

        let uploadedMedia: { url: string; type: MediaType } | null = null;

        if (args.media) {
            uploadedMedia = await processMedia(args.media);
        }

        const comment = await prisma.comment.create({
            data: {
                content: args.content,
                postId: args.postId,
                parentId: args.parentId,
                authorId: user.id,
                media: uploadedMedia? { create: uploadedMedia }: undefined
            },
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

async function likeComment(user: User, args: z.infer<typeof targetSchema>) {
    await prisma.like.create({
        data: {
            commentId: args.targetId,
            userId: user.id
        }
    });
}

async function unlikeComment(user: User, args: z.infer<typeof targetSchema>) {
    await prisma.like.delete({
        where: {
            userId_commentId: {
                userId: user.id,
                commentId: args.targetId,
            },
        },
    });
}