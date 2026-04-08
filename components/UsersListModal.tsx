"use client";

import UserRow from "./UserRow";
import { User } from "@/app/generated/prisma/browser";
import { ReactNode } from "react";
import GeneralModal from "./GeneralModal";

export default function UsersListModal({
    title,
    users,
    children,
}: {
    title: string;
    users: User[];
    children: ReactNode;
}) {
    return (
        <GeneralModal
            title={title}
            trigger={children}
        >
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
        </GeneralModal>
    )
}