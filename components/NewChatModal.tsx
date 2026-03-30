"use client";

import { useState } from "react";
import { createChatAction } from "@/app/actions/messages";
import { useAppContext } from "@/app/Providers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUsersAction } from "@/app/actions/users";

export default function NewChatModal({ open, onClose, setCurrentChat }: any) {
    const { state, dispatch } = useAppContext();
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const chats = state.user?.participant || [];

    if (!open) return null;

    async function handleSearch(q: string) {
        setQuery(q);
        const res = await searchUsersAction(q);
        setUsers(res || []);
    }

    async function handleCreate(user: any) {
        setLoading(true);

        try {
            const chat = await createChatAction(user.id);
            
            if(!chats.find((c: any) => c.chatId === chat.id)) {
                dispatch({
                    type: "addChat",
                    payload: {
                        chat
                    },
                });
            }
            
            setCurrentChat(chat);

            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-background p-6 rounded-xl w-full max-w-md space-y-4">
                <Input
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />

                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {users.map((u) => (
                        <div
                            key={u.id}
                            onClick={() => handleCreate(u)}
                            className="p-2 hover:bg-muted rounded cursor-pointer"
                        >
                            {u.name}
                        </div>
                    ))}
                </div>

                <Button onClick={onClose} className="w-full">
                    Close
                </Button>
            </div>
        </div>
    );
}