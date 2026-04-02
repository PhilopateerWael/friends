"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "./ui/scroll-area";
import UserRow from "./UserRow";
import { ProfileUser } from "@/app/types";

export default function UsersListModal({
    open,
    onClose,
    title,
    users,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    users: ProfileUser["followers"][0]["follower"][];
}) {
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md h-[70vh] flex flex-col p-0 max-sm:h-screen max-sm:rounded-none max-md:max-w-screen">

                <DialogTitle className="px-6 pt-4 shrink-0">
                    {title}
                </DialogTitle>

                <ScrollArea className="flex-1 min-h-0 px-6">
                    <div className="space-y-4">
                        {users.length ? (
                            users.map((u) => (
                                <UserRow key={u.id} user={u} />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center">
                                Empty
                            </p>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}