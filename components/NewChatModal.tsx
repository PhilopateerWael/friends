"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import { createChatAction } from "@/app/actions/messages";
import { useAppContext } from "@/app/Providers";
import { User } from "@/app/generated/prisma/client";
import UsersSearch from "./UsersSearch";
import { toast } from "sonner";
import { Chat } from "@/app/types";

export default function NewChatModal({ open, onClose }: any) {
    const { state, dispatch } = useAppContext();

    const [loading, setLoading] = useState(false);

    const chats = state.user?.participant || [];

    async function handleCreate(user: User) {
        setLoading(true);

        const { success, data } = await createChatAction(user.id);
        const chat: Chat = data!

        if (success) {
            if (!chats.find((c) => c.chatId === chat.id)) {
                dispatch({
                    type: "addChat",
                    payload: chat
                });
            }

            dispatch({ type: "setOpenedChatId", payload: chat.id });
        } else {
            toast.error("Failed to create chat.");
        }

        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="h-[70dvh] max-h-fit flex flex-col p-0 pb-6">

                <div className="px-6 pt-4 space-y-1">
                    <DialogTitle>New Chat</DialogTitle>
                </div>

                <div className="h-px bg-border my-2" />

                <div className="flex-1 px-6 pb-4">
                    <UsersSearch action={handleCreate} isAbsolute={false} actionLoading={loading} />
                </div>
            </DialogContent>
        </Dialog>
    );
}