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
import { useState } from "react";
import { useAppContext } from "@/app/Providers";
import { acceptFollowRequestAction, rejectFollowRequestAction } from "@/app/actions/users";
import { toast } from "sonner";

export default function FollowRequestsModal() {

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { state, dispatch } = useAppContext();

    const users = state.user?.followers.filter((f) => f.status === "PENDING").map((f) => f.follower) || [];

    const handleAccept = async (userId: string) => {
        setLoadingId(userId);
        
        const { success } = await acceptFollowRequestAction(userId);

        if (success) {
            dispatch({
                type: "setUser",
                payload: {
                    ...state.user!,
                    followers: state.user!.followers.map(f => {
                        if (f.followerId === userId) {
                            return { ...f, status: "ACCEPTED" }
                        }
                        return f;
                    })
                }
            })
        } else {
            toast.error("Failed to accept follow request")
        }

        setLoadingId(null);
    };

    const handleReject = async (userId: string) => {
        setLoadingId(userId);

        const { success } = await rejectFollowRequestAction(userId);

        if (success) {
            dispatch({
                type: "setUser",
                payload: {
                    ...state.user!,
                    followers: state.user!.followers.filter(f => f.followerId !== userId)
                }
            })
        } else {
            toast.error("Failed to reject follow request")
        }

        setLoadingId(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {state.user?.privacy === "PRIVATE" && (
                    <Button className="flex-1">
                        Follow Requests
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-md h-[70vh] flex flex-col p-0 max-sm:h-screen max-sm:rounded-none max-md:max-w-screen">

                <DialogTitle className="px-6 pt-4 shrink-0">
                    Follow Requests
                </DialogTitle>

                <ScrollArea className="flex-1 min-h-0 px-6">
                    <div className="space-y-4">
                        {users.length ? (
                            users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    action={
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleAccept(user.id)}
                                                className="cursor-pointer"
                                                disabled={loadingId === user.id}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReject(user.id)}
                                                className="cursor-pointer"
                                                disabled={loadingId === user.id}
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