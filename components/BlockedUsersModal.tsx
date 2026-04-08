"use client";

import UserRow from "./UserRow";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppContext } from "@/app/Providers";
import { unblockAction } from "@/app/actions/users";
import GeneralModal from "./GeneralModal";

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
        <GeneralModal
            title="Blocked Users"
            trigger={
                <Button variant="destructive" className="flex-1 cursor-pointer">
                    Blocked Users
                </Button>
            }
        >
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
        </GeneralModal>
    )
}