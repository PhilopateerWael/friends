"use server"

import { messageSchema, targetSchema } from "@/lib/requestSchemas"
import { MediaType, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { ValidatedActionWithAuth } from "../util/Middleware"
import { processMedia } from "../util/Cloudinary"
import ably from "@/lib/ably"
import { chatIncludes, messageIncludes } from "./helpers"

export async function createmessageAction(content: string, media: File[], chatId: string) {
    return await ValidatedActionWithAuth(messageSchema, { content, media, chatId }, createmessage);
}

export async function createChatAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, createChat);
}

export async function getMessagesForChatAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, getMessagesForChat);
}

async function createmessage(user: User, args: z.infer<typeof messageSchema>) {
    let chat;

    chat = await prisma.chat.findUnique({
        where: {
            id: args.chatId,
        },
        include: {
            participants: true
        }
    });


    if (!chat) {
        throw new Error("Chat not found");
    }

    const otherUser = chat.participants.find((p) => p.userId !== user.id);

    const targetUser = await prisma.user.findUnique({
        where: {
            id: otherUser?.userId,
            blocks: { none: { blockedId: user.id } },
            blockedBy: { none: { userId: user.id } }
        },
    });

    if (!targetUser || targetUser.id === user.id) {
        throw new Error("User not found");
    }

    if (!chat.participants.some(p => p.userId === user.id)) {
        throw new Error("User not part of the chat");
    }

    if (!otherUser) {
        throw new Error("I dont think we can reach this case but like typescript is making me paranoid");
    }

    let uploadedMedia: { url: string; type: MediaType }[] = [];

    if (args?.media?.length > 0) {
        uploadedMedia = await Promise.all(args.media.map(processMedia));
    }

    const message = await prisma.message.create({
        data: {
            content: args.content,
            senderId: user.id,
            chatId: chat.id,
            media: uploadedMedia ? { create: uploadedMedia } : undefined
        },
        include: messageIncludes
    });

    const channel = ably.channels.get(`user-${otherUser.userId}`);

    await channel.publish("message", message);

    return message;
}

async function createChat(user: User, args: z.infer<typeof targetSchema>) {
    const targetUser = await prisma.user.findUnique({
        where: {
            id: args.targetId,
            blocks: { none: { blockedId: user.id } },
            blockedBy: { none: { userId: user.id } }
        },
    });

    if (!targetUser || targetUser.id === user.id) {
        throw new Error("User not found");
    }

    let chat = await prisma.chat.findFirst({
        where: {
            participants: {
                every: {
                    userId: { in: [user.id, args.targetId] }
                }
            }
        },
        include: chatIncludes
    });

    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                participants: {
                    create: [
                        { userId: user.id },
                        { userId: args.targetId }
                    ]
                }
            },
            include: chatIncludes
        });

        const targetChannel = ably.channels.get(`user-${targetUser.id}`);

        await targetChannel.publish("chat", chat)
    }

    return chat;
}

async function getMessagesForChat(user: User, args: z.infer<typeof targetSchema>) {
    const chat = await prisma.chat.findUnique({
        where: {
            id: args.targetId,
            participants: {
                some: {
                    userId: user.id
                }
            }
        }, include: {
            messages: {
                include: messageIncludes
            },
            ...chatIncludes
        }
    })

    if (!chat) {
        throw new Error("Chat not found or user not a participant");
    }

    return chat.messages;
}