"use client";

import { useState } from "react";
import { useAppContext } from "@/app/Providers";
import ChatView from "./ChatView";
import NewChatModal from "./NewChatModal";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Chat } from "@/app/types";

export default function ChatList() {
    const { state, dispatch } = useAppContext();
    const [openNewChat, setOpenNewChat] = useState(false);

    const chats = state.user?.participant || [];

    if (state.oppenedChatId) {
        return (
            <ChatView
                chat={chats.find((c) => c.chatId === state.oppenedChatId)?.chat!}
                onBack={() => dispatch({ type: "setOpenedChatId", payload: "" })}
            />
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 relative">
            <h1 className="text-xl font-semibold mb-4">Messaging</h1>

            <div className="space-y-3 pb-12">
                {chats.length ? (
                    chats.map((p) => {
                        const chat = p.chat;

                        const otherUser = chat.participants.find(
                            (part) => part.userId !== state.user?.id
                        )?.user;

                        return (
                            <Card
                                key={chat.id}
                                className="cursor-pointer hover:bg-muted transition py-2"
                                onClick={() => dispatch({ type: "setOpenedChatId", payload: chat.id })}
                            >
                                <CardContent className="flex items-center gap-3 px-3">
                                    <Avatar>
                                        <AvatarImage src={otherUser?.image} />
                                        <AvatarFallback>
                                            {otherUser?.name}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="font-medium">
                                        {otherUser?.name}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center text-muted-foreground">
                        No chats yet
                    </div>
                )}
            </div>

            <Button
                className="fixed max-md:bottom-18 bottom-12 right-6 rounded-full shadow-lg cursor-pointer"
                size="icon"
                onClick={() => setOpenNewChat(true)}
            >
                <Plus />
            </Button>

            <NewChatModal
                open={openNewChat}
                onClose={() => setOpenNewChat(false)}
            />
        </div>
    );
}