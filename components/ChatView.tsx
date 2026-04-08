"use client";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/Providers";
import {
    createmessageAction,
    getMessagesForChatAction,
} from "@/app/actions/messages";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrowLeft, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import MediaAttacher from "./MediaAttacher";
import Message from "./Message";
import MediaPreviewList from "./MediaPreviewList";
import { Chat } from "@/app/types";
import { toast } from "sonner";

type MediaFile = {
    file: File;
    preview: string;
};

export default function ChatView({
    chat,
    onBack,
}: {
    chat: Chat;
    onBack: () => void;
}) {
    const { state, dispatch } = useAppContext();
    const messages = state.messages;

    const [text, setText] = useState("");
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [sending, setSending] = useState(false);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const otherUser = chat.participants.find(
        (p) => p.userId !== state.user?.id
    )?.user;

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files)
            .filter(
                (file) =>
                    file.type.startsWith("image/") ||
                    file.type.startsWith("video/")
            )
            .map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

        e.target.value = "";
        setMedia((prev) => [...prev, ...filesArray]);
    };

    const handleRemoveMedia = (index: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    async function sendMessage() {
        if (!text.trim() && media.length === 0) return;

        setSending(true);

        const MAX_TOTAL = 10 * 1024 * 1024;
        const totalSize = media.reduce((acc, m) => acc + m.file.size, 0);

        if (totalSize > MAX_TOTAL) {
            alert("Media too large (max 10MB)");
            setSending(false);
            return;
        }

        const { success, data } = await createmessageAction(
            text,
            media.map((m) => m.file),
            chat.id
        );

        if (success)
            dispatch({ type: "addMessage", payload: data! });
        else
            toast.error("Failed to send message");

        setText("");
        setMedia([]);

        setSending(false);
    }

    useEffect(() => {
        async function fetchMessages() {
            const { success, data } = await getMessagesForChatAction(chat.id);
            
            if (success)
                dispatch({ type: "setMessages", payload: data || [] });
            else
                toast.error("Failed to load messages");
        }

        fetchMessages();

        return () => {
            dispatch({ type: "clearMessages" });
        };
    }, [chat.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-w-2xl mx-auto max-md:px-2 max-md:pt-3 p-4 flex flex-col max-md:h-[calc(100dvh-4rem)] h-dvh max-md:pb-2">
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
                            <Message
                                key={i}
                                msg={msg}
                                isOwn={msg.senderId === state.user?.id}
                            />
                        ))}
                        <div ref={bottomRef} />
                    </div>
                </ScrollArea>
            </div>

            <div className="flex flex-col gap-2">
                <MediaPreviewList media={media} onRemove={handleRemoveMedia} />

                <div className="flex gap-2 items-end">
                    <MediaAttacher handleMediaChange={handleMediaChange} />

                    <Input
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />

                    <Button
                        onClick={sendMessage}
                        disabled={sending}
                        className="min-w-[70px]"
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}