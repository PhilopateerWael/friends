"use client";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/Providers";
import { createmessageAction, getMessagesForChatAction } from "@/app/actions/messages";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export default function ChatView({
    chat,
    onBack,
}: {
    chat: any;
    onBack: () => void;
}) {
    const { state } = useAppContext();

    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const otherUser = chat.participants.find(
        (p: any) => p.userId !== state.user?.id
    )?.user;

    async function sendMessage() {
        if (!text.trim()) return;

        setSending(true);

        try {
            const message = await createmessageAction(text, [], chat.id);

            setMessages((prev) => [...prev, message]);
            setText("");
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    }

    useEffect(() => {
        async function fetchMessages() {
            const messages = await getMessagesForChatAction(chat.id);
            setMessages(messages);
        }
        fetchMessages()
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-w-2xl mx-auto max-md:px-2 max-md:pt-3 max-md:pb-0 p-4 flex flex-col max-md:h-[calc(100vh-4rem)] h-screen">
            <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft />
                </Button>

                <Avatar>
                    <AvatarImage src={otherUser?.image} />
                    <AvatarFallback>
                        {otherUser?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="font-medium">{otherUser?.name}</div>
            </div>

            <div className="flex-1 mb-4 overflow-hidden">
                <ScrollArea className="h-full px-3">
                    <div className="gap-2 flex flex-col">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg w-fit max-w-[70%] ${msg.senderId === state.user?.id
                                    ? "ml-auto bg-primary text-black"
                                    : "bg-muted"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                </ScrollArea>
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button onClick={sendMessage} disabled={sending}>
                    Send
                </Button>
            </div>
        </div>
    );
}