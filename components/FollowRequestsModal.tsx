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

export default function FollowRequestsModal({
    open,
    onClose,
    requests,
    onAccept,
    onReject,
    actionLoading,
}: {
    open: boolean;
    onClose: () => void;
    requests: UserPopulated["followers"];
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
    actionLoading: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md h-[70vh] flex flex-col p-0 max-sm:h-screen max-sm:rounded-none max-md:max-w-screen">

                <DialogTitle className="px-6 pt-4 shrink-0">
                    Follow Requests
                </DialogTitle>

                <ScrollArea className="flex-1 min-h-0 px-6">
                    <div className="space-y-4">
                        {requests.length ? (
                            requests.map((req) => (
                                <UserRow
                                    key={req.id}
                                    user={req.follower}
                                    action={
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => onAccept(req.id)}
                                                className="cursor-pointer"
                                                disabled={actionLoading}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onReject(req.id)}
                                                className="cursor-pointer"
                                                disabled={actionLoading}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    }
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center">
                                No requests
                            </p>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}