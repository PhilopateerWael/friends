"use client";

import { useState } from "react";
import { createChatAction } from "@/app/actions/messages";
import { useAppContext } from "@/app/Providers";
import { Button } from "@/components/ui/button";
import { searchUsersAction } from "@/app/actions/users";
import { User } from "@/app/generated/prisma/client";
import UsersSearch from "./UsersSearch";

export default function NewChatModal({ open, onClose, setCurrentChat }: any) {
    const { state, dispatch } = useAppContext();
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const chats = state.user?.participant || [];

    if (!open) return null;

    async function handleSearch(q: string) {
        setQuery(q);
        const res = await searchUsersAction(q);
        setUsers(res || []);
    }

    async function handleCreate(user: User) {
        setLoading(true);

        try {
            const chat = await createChatAction(user.id);
            const participant = chat.participants.find((p) => p.userId === user.id);

            if (!chats.find((c) => c.chatId === chat.id)) {
                if (!participant) return;

                dispatch({
                    type: "addChat",
                    payload: {
                        ...participant,
                        chat
                    }
                });
            }

            setCurrentChat(chat);

            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            {/* modal */}
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-background/95 backdrop-blur-xl border shadow-2xl rounded-2xl p-6 space-y-5 animate-in zoom-in-95 fade-in">

                    {/* header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">New Chat</h2>
                            <p className="text-sm text-muted-foreground">
                                Search for a user to start chatting
                            </p>
                        </div>
                    </div>

                    {/* divider */}
                    <div className="h-px bg-border" />

                    {/* content */}
                    <div className="pt-1">
                        <UsersSearch action={handleCreate} />
                    </div>

                    {/* footer */}
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="text-sm cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
}