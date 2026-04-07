"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { User } from "@/app/generated/prisma/browser";

type Props = {
    user: User;
    action?: React.ReactNode;
};

export default function UserRow({ user, action }: Props) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                        {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="font-medium hover:underline cursor-pointer" onClick={() => redirect("/user/" + user.id)}>{user.name}</div>
            </div>

            {action && <div className="flex gap-2">{action}</div>}
        </div>
    );
}