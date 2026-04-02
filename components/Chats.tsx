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
    const { state } = useAppContext();

    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [openNewChat, setOpenNewChat] = useState(false);

    const chats = state.user?.participant || [];

    if (selectedChat) {
        return (
            <ChatView
                chat={selectedChat}
                onBack={() => setSelectedChat(null)}
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
                                onClick={() => setSelectedChat(chat)}
                            >
                                <CardContent className="flex items-center gap-3 px-3">
                                    <Avatar>
                                        <AvatarImage src={otherUser?.image} />
                                        <AvatarFallback>
                                            {otherUser?.name
                                                ?.slice(0, 2)
                                                .toUpperCase()}
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
                className="fixed bottom-16 right-6 rounded-full shadow-lg"
                size="icon"
                onClick={() => setOpenNewChat(true)}
            >
                <Plus />
            </Button>

            <NewChatModal
                open={openNewChat}
                onClose={() => setOpenNewChat(false)}
                setCurrentChat={setSelectedChat}
            />
        </div>
    );
}