import { Prisma } from "@/app/generated/prisma/client";
import { postIncludes , messageIncludes, populatedUserIncludes, chatIncludes } from "./actions/helpers";

export type UserPopulated = Prisma.UserGetPayload<{
    include: typeof populatedUserIncludes
}>;

export type Comment = Prisma.CommentGetPayload<{
    include: {
        author: true
    }
}>;

export type Post = Prisma.PostGetPayload<{
    include: typeof postIncludes;
}>;

export type Message = Prisma.MessageGetPayload<{
    include: typeof messageIncludes
}>;

export type Chat = Prisma.ChatGetPayload<{
    include: typeof chatIncludes
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

export type Follow = Prisma.FollowGetPayload<{}>;

export type Block = Prisma.BlockGetPayload<{
    include: {
        blocked: true;
    };
}>;