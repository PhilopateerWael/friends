import { UserPopulated } from "@/app/types";
import { ScrollArea } from "./ui/scroll-area";
import UserRow from "./UserRow";
import { Button } from "@/components/ui/button";

export default function FollowRequestsModal({
    open,
    onClose,
    requests,
    onAccept,
    onReject,
}: {
    open: boolean;
    onClose: () => void;
    requests: UserPopulated["followers"];
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 max-h-screen">
            <div className="bg-background p-6 rounded-xl w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Follow Requests</h2>
                <ScrollArea className="h-64">

                    {requests.length ? (
                        requests.map((req) => (
                            <UserRow
                                key={req.id}
                                user={req.follower}
                                action={
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={() => onAccept(req.id)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onReject(req.id)}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                }
                            />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">
                            No requests
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