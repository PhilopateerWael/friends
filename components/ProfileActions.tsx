"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import FollowRequestsModal from "./FollowRequestsModal";
import BlockedUsersModal from "./BlockedUsersModal";
import EditProfileModal from "./EditProfileModal";
import { useAppContext } from "@/app/Providers";
import { User } from "@/app/generated/prisma/browser";
import { useState } from "react";
import { blockAction, followAction, unfollowAction } from "@/app/actions/users";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function ProfileActions({
    user
}: {
    user: User
}) {
    const { state, dispatch } = useAppContext()

    const isOwnProfile = state.user?.id === user.id;
    const isBlocked = state.user?.blocks.some(b => b.blockedId === state.user?.id);
    const isFollowing = state.user?.following.some(f => f.followingId === user.id && f.status === "ACCEPTED");
    const isPending = state.user?.following.some(f => f.followerId=== user.id && f.status === "PENDING");

    const [followLoading, setFollowLoading] = useState(false);
    const [blockLoading, setBlockLoading] = useState(false);

    const handleFollow = async () => {
        setFollowLoading(true);

        if (isFollowing) {
            const { success } = await unfollowAction(user.id)
            if (success) {
                dispatch({
                    type: "setUser", payload: {
                        ...state.user!,
                        following: state.user!.following.filter(f => f.followingId !== user.id)
                    }
                })
            } else {
                toast.error("Failed to unfollow user")
            }
        } else {
            const { success, data } = await followAction(user.id)

            if (success) {
                dispatch({
                    type: "setUser", payload: {
                        ...state.user!,
                        following: [...state.user!.following, data!]
                    }
                })
            } else {
                toast.error("Failed to follow user")
            }
        }

        setFollowLoading(false);
    };

    const handleBlock = async () => {
        setBlockLoading(true);

        if (!isBlocked) {
            const { success, data } = await blockAction(user.id);
            if (success) {
                dispatch({
                    type: "setUser", payload: {
                        ...state.user!,
                        blocks: [...state.user!.blocks, data!]
                    }
                })

                redirect("/")
            } else {
                toast.error("Failed to block user")
            }
        }

        setBlockLoading(false);
    };

    return (
        <div className="mt-5 w-full flex gap-3 flex-wrap max-sm:flex-col">
            {isOwnProfile ? (
                <>
                    {state.user?.privacy === "PRIVATE" && (
                        <FollowRequestsModal />
                    )}

                    <BlockedUsersModal />

                    <EditProfileModal />
                </>
            ) : (
                <>
                    <Button
                        onClick={handleFollow}
                        disabled={followLoading}
                        className="flex-1 cursor-pointer"
                    >
                        {followLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isFollowing ? (
                            "Unfollow"
                        ) : isPending ? (
                            "Requested"
                        ) : (
                            "Follow"
                        )}
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleBlock}
                        disabled={blockLoading}
                        className="flex-1 cursor-pointer"
                    >
                        {blockLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isBlocked ? (
                            "Unblock"
                        ) : (
                            "Block"
                        )}
                    </Button>
                </>
            )}
        </div>
    );
}