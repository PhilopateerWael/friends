"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from "./ui/scroll-area";
import UserRow from "./UserRow";
import { Button } from "@/components/ui/button";
import { UserPopulated } from "@/app/types";
import { useState } from "react";
import { useAppContext } from "@/app/Providers";
import { unblockAction } from "@/app/actions/users";

export default function BlockedUsersModal() {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { state, dispatch } = useAppContext();
    const blocks = state.user?.blocks || [];

    const handleUnblock = async (blockedId: string) => {
        setLoadingId(blockedId);
        const { success } = await unblockAction(blockedId);

        if (success) {
            dispatch({
                type: "setUser",
                payload: {
                    ...state.user!,
                    blocks: state.user!.blocks.filter(b => b.blockedId !== blockedId)
                }
            })
        }

        setLoadingId(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1 cursor-pointer">
                    Blocked Users
                </Button>
            </DialogTrigger>

            <DialogContent className="h-[70dvh] flex flex-col p-0 pb-6">
                <DialogTitle className="px-6 pt-4 shrink-0">
                    Blocked Users
                </DialogTitle>

                <ScrollArea className="flex-1 min-h-0 px-6">
                    <div className="space-y-4">
                        {blocks.length ? (
                            blocks.map((b) => (
                                <UserRow
                                    key={b.id}
                                    user={b.blocked}
                                    action={
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleUnblock(b.blockedId)}
                                            className="cursor-pointer"
                                            disabled={loadingId === b.blockedId}
                                        >
                                            Unblock
                                        </Button>
                                    }
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center">
                                No blocked users
                            </p>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}