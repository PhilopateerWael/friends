import { Prisma } from "@/app/generated/prisma/client";
import { postIncludes, messageIncludes, populatedUserIncludes, chatIncludes } from "./actions/helpers";

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