import { ScrollArea } from "./ui/scroll-area";
import UserRow from "./UserRow";
import { Button } from "@/components/ui/button";

export default function BlockedUsersModal({
    open,
    onClose,
    blocks,
    onUnblock,
}: any) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-background p-6 rounded-xl w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Blocked Users</h2>
                <ScrollArea className="h-64">
                    {blocks.length ? (
                        blocks.map((b: any) => (
                            <UserRow
                                key={b.id}
                                user={b.blocked}
                                action={
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onUnblock(b.blockedId)}
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
                </ScrollArea>
                <Button onClick={onClose} className="w-full">
                    Close
                </Button>
            </div>
        </div>
    );
}