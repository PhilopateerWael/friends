"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import type { Privacy } from "@/app/generated/prisma/client";
import { useAppContext } from "@/app/Providers";
import { editProfileAction } from "@/app/actions/accountManagement";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export default function EditProfileModal() {
    const { state, dispatch } = useAppContext();

    const [name, setname] = useState(state.user?.name || "");
    const [bio, setBio] = useState(state.user?.bio || "");
    const [privacy, setPrivacy] = useState<Privacy>(state.user?.privacy || "PUBLIC");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);

        const input = {
            name,
            bio,
            image : null as File | null,
            privacy,
        };

            const { success, data } = await editProfileAction(input)

            if(!success) return toast.error("Failed to update profile");

            dispatch({ type: "setUser", payload: data });

            setIsLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                    <Settings />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md flex flex-col p-0 max-sm:h-screen max-sm:rounded-none max-md:max-w-screen">

                <DialogTitle className="px-6 pt-4 shrink-0">
                    Edit Profile
                </DialogTitle>

                <div className="flex-1 px-6 py-4 space-y-4">
                    <Input
                        placeholder="name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
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

                    <DialogClose asChild>
                        <Button
                            onClick={handleSave}
                            className="flex-1 cursor-pointer"
                            disabled={isLoading}
                        >
                            Save
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="flex-1 cursor-pointer"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </DialogClose>

                </div>

            </DialogContent>
        </Dialog>
    );
}