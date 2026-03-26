import { ScrollArea } from "./ui/scroll-area";
import UserRow from "./UserRow";
import { Button } from "@/components/ui/button";

export default function UsersListModal({
    open,
    onClose,
    title,
    users,
}: any) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-background p-6 rounded-xl w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <ScrollArea className="h-64">

                    {users.length ? (
                        users.map((u: any) => (
                            <UserRow key={u.id} user={u} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">
                            Empty
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