"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "./ui/scroll-area";
import UserRow from "./UserRow";
import { Button } from "@/components/ui/button";
import { UserPopulated } from "@/app/types";

export default function BlockedUsersModal({
    open,
    onClose,
    blocks,
    onUnblock,
    actionLoading,
}: {
    open: boolean;
    onClose: () => void;
    blocks: UserPopulated["blocks"];
    onUnblock: (blockedId: string) => void;
    actionLoading: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md h-[70vh] flex flex-col p-0 max-sm:h-screen max-sm:rounded-none max-md:max-w-screen">

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
                                            onClick={() => onUnblock(b.blockedId)}
                                            className="cursor-pointer"
                                            disabled={actionLoading}
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