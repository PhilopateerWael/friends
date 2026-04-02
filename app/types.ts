import { Prisma } from "@/app/generated/prisma/client";
import { TokenDetails } from "ably";

export type UserPopulated = Prisma.UserGetPayload<{
    include: {
        followers: { include: { follower: true } };
        blocks: { include: { blocked: true } };
        following: { include: { following: true } };
        participant: {
            include: {
                chat: {
                    include: {
                        participants: {
                            include: { user: true };
                        };
                    };
                };
            };
        };
    };
}>;

export type Comment = Prisma.CommentGetPayload<{
    select: {
        author: true;
        content: true;
        id: true;
        parentId: true;
        postId: true;
        createdAt: true;
    };
}>;

export type CommentWithAuthor = Prisma.CommentGetPayload<{
    select: {
        content: true;
        createdAt: true;
        id: true;
        author: {
            select: {
                id: true;
                name: true;
                image: true;
            };
        };
    };
}>;

export const postIncludes = {
    author: true,
    media: true,
    likes: {
        include: {
            user: true
        }
    }
} satisfies Prisma.PostInclude;

export type Post = Prisma.PostGetPayload<{
    include: typeof postIncludes;
}>;

export type CreatePostResponse =
    | { success: true; post: Post }
    | { success: false; error: string };


export type Message = Prisma.MessageGetPayload<{
    include: {
        sender: true;
        media: true;
    };
}>;

export type Chat = Prisma.ChatGetPayload<{
    include: {
        participants: {
            include: {
                user: true;
            };
        };
    };
}>;

export type ChatWithMessages = Prisma.ChatGetPayload<{
    include: {
        messages: {
            include: {
                sender: true;
                media: true;
            };
        };
    };
}>;


export type ProfileUser = Prisma.UserGetPayload<{
    include: {
        followers: {
            include: { follower: true };
        };
        following: {
            include: { following: true };
        };
    };
}>;

export type ProfilePost = Prisma.PostGetPayload<{
    select: {
        id: true;
        content: true;
        createdAt: true;
        author: true;
        media: true;
        likes: {
            include: { user: true };
        };
    };
}>;

export type ProfileResponse = {
    user: ProfileUser;
    posts: ProfilePost[];
    likedPosts: ProfilePost[];
    canSeePosts: boolean;
} | null;


export type Follow = Prisma.FollowGetPayload<{}>;

export type Block = Prisma.BlockGetPayload<{
    include: {
        blocked: true;
    };
}>;

export type SearchUser = Prisma.UserGetPayload<{}>;

export type ActionSuccess = { success: true };
export type ActionError = { success: false; message: string };