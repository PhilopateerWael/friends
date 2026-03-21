"use server"

import { commentSchema, targetSchema } from "@/lib/requestSchemas"
import { FollowStatus, MediaType, Privacy, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { ValidatedActionWithAuth } from "../util/Middleware"
import { processMedia } from "../util/Cloudinary"

export async function createCommentAction(content: string, postId: string, media?: File, parentId?: string) {
    return await ValidatedActionWithAuth(commentSchema, { content, media, postId, parentId }, createComment);
}

export async function deleteCommentAction(commentId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: commentId }, deleteComment);
}

export async function getCommentsForPostAction(postId: string) {
    return ValidatedActionWithAuth(targetSchema, { targetId: postId }, getCommentsForPost);
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
                media: uploadedMedia ? { create: uploadedMedia } : undefined
            },
            select: {
                author: true,
                content: true,
                id: true,
                media: true,
                parentId: true,
                postId: true,
                createdAt: true,
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

async function getCommentsForPost(user: User, args : z.infer<typeof targetSchema>) {
    const myId = user.id
    const postId = args.targetId

    const post = await prisma.post.findMany({
        where: {
            AND: [
                {
                    id: postId
                },
                {
                    author: {
                        blocks: {
                            none: {
                                blockedId: myId
                            }
                        }
                    }
                },
                {
                    author: {
                        blockedBy: {
                            none: {
                                userId: myId
                            }
                        }
                    }
                },
                {
                    OR: [
                        {
                            author: {
                                privacy: Privacy.PUBLIC
                            }
                        },
                        {
                            author: {
                                privacy: Privacy.PRIVATE,
                                followers: {
                                    some: {
                                        followerId: myId,
                                        status: FollowStatus.ACCEPTED
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    });

    if(post.length === 0) {
        throw new Error("Post not found");
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId,
        },
        select : {
            media : true,
            content : true ,
            createdAt : true,
            id : true,
            author : {
                select : {
                    id : true,
                    name : true,
                    image : true,
                }
            }
        },orderBy :{
            createdAt : "desc"
        }
    })

    return comments;
}