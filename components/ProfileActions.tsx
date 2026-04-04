"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Edit, Settings } from "lucide-react";

export default function ProfileActions({
    isOwnProfile,
    relationship,
    followLoading,
    blockLoading,
    handleFollow,
    handleBlock,
    openEdit,
    openRequests,
    openBlocked,
    privacy,
}: any) {
    return (
        <div className="mt-5 w-full flex gap-3">
            {isOwnProfile ? (
                <>
                    {privacy === "PRIVATE" && (
                        <Button onClick={openRequests} className="flex-1">
                            Follow Requests
                        </Button>
                    )}

                    <Button onClick={openBlocked} variant="secondary" className="flex-1">
                        Blocked Users
                    </Button>

                    <Button onClick={openEdit} variant="outline">
                        <Settings />
                    </Button>
                </>
            ) : (
                <>
                    <Button onClick={handleFollow} disabled={followLoading} className="flex-1">
                        {followLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : relationship?.isFollowing ? (
                            "Unfollow"
                        ) : relationship?.isPending ? (
                            "Requested"
                        ) : (
                            "Follow"
                        )}
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleBlock}
                        disabled={blockLoading}
                        className="flex-1"
                    >
                        {blockLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : relationship?.isBlocked ? (
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