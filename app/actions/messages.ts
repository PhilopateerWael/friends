"use server"

import { messageSchema } from "@/lib/requestSchemas"
import { MediaType, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { ValidatedActionWithAuth } from "../util/Middleware"
import { processMedia } from "../util/Cloudinary"

export async function createmessageAction(content: string, media: File[], recipientId: string, isChat: boolean) {
    ValidatedActionWithAuth(messageSchema, { content, media, recipientId, isChat }, createmessage);
}

async function createmessage(user: User, args: z.infer<typeof messageSchema>) {
    try {
        let chat;

        if (args.isChat) {
            chat = await prisma.chat.findUnique({
                where: {
                    id: args.recipientId,
                },
                include: {
                    participants: true
                }
            });

            if (!chat) {
                throw new Error("Chat not found");
            }

            if (!chat.participants.some(p => p.userId === user.id)) {
                throw new Error("User not part of the chat");
            }
        } else {
            const recepient = await prisma.user.findUnique({
                where: {
                    id: args.recipientId,
                },
            });

            if (!recepient) {
                throw new Error("Recipient not found");
            }

            if (recepient.id === user.id) {
                throw new Error("Cannot send message to yourself");
            }

            chat = await prisma.chat.create({
                data: {
                    participants: {
                        connect: [
                            { id: user.id },
                            { id: args.recipientId }
                        ]
                    }
                }
            });
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
        });

        return message;
    } catch (error) {
        console.error("Create message failed:", error);
        throw new Error("Failed to create message");
    }
}