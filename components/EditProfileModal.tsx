"use client";

import { Card, CardContent } from "@/components/ui/card";
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
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md animate-in fade-in zoom-in-95">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Edit Profile</h2>

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
                        <option
                            value="PUBLIC"
                            className="bg-muted text-muted-foreground"
                        >
                            Public
                        </option>
                        <option
                            value="PRIVATE"
                            className="bg-muted text-muted-foreground"
                        >
                            Private
                        </option>
                    </select>

                    <div className="flex gap-3">
                        <Button onClick={onSave} className="flex-1">
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}