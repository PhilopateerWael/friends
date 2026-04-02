"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { Privacy } from "@/app/generated/prisma/client";

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: () => void;

    username: string;
    setUsername: (v: string) => void;

    bio: string;
    setBio: (v: string) => void;

    privacy: Privacy;
    setPrivacy: (v: Privacy) => void;
};

export default function EditProfileModal({
    open,
    onClose,
    onSave,
    username,
    setUsername,
    bio,
    setBio,
    privacy,
    setPrivacy,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md flex flex-col p-0 max-sm:h-screen max-sm:rounded-none max-md:max-w-screen">

                <DialogTitle className="px-6 pt-4 shrink-0">
                    Edit Profile
                </DialogTitle>

                <div className="flex-1 px-6 py-4 space-y-4">
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Textarea
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />

                    <select
                        className="w-full border rounded p-2 bg-muted text-muted-foreground"
                        value={privacy}
                        onChange={(e) =>
                            setPrivacy(e.target.value as Privacy)
                        }
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                </div>

                <div className="border-t p-4 flex gap-3 shrink-0">
                    <Button
                        onClick={onSave}
                        className="flex-1 cursor-pointer"
                    >
                        Save
                    </Button>

                    <Button
                        variant="outline"
                        className="flex-1 cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}