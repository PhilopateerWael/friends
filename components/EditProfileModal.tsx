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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";
import type { Privacy } from "@/app/generated/prisma/client";
import { useAppContext } from "@/app/Providers";
import { editProfileAction } from "@/app/actions/accountManagement";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { changePasswordAction, signOutAction } from "@/app/actions/auth";
import GeneralModal from "./GeneralModal";

export default function EditProfileModal() {
    const { state, dispatch } = useAppContext();

    const [name, setname] = useState(state.user?.name || "");
    const [bio, setBio] = useState(state.user?.bio || "");
    const [privacy, setPrivacy] = useState<Privacy>(state.user?.privacy || "PUBLIC");

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(state.user?.image || "");

    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleImage = (file: File) => {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setIsLoading(true);

        const input = {
            name,
            bio,
            image: image || null,
            privacy,
        };

        const { success, data } = await editProfileAction(input);

        if (success)
            dispatch({ type: "setUser", payload: data });
        else
            toast.error("Failed to update profile");

        setIsLoading(false);
    };

    const handleChangePassword = async () => {
        const { success } = await changePasswordAction(oldPassword, password);
        if (success)
            toast.success("Password changed successfully");
        else
            toast.error("Failed to change password");
    };

    const handleLogout = async () => {
        await signOutAction();
    };
    return (
        <GeneralModal title="Settings"
            trigger={
                <Button variant="outline" className="cursor-pointer">
                    <Settings />
                </Button>
            }
        >
            <Tabs defaultValue="general" className="flex-1 px-6 pt-2 mt-2">
                <TabsList className="w-full gap-2">
                    <TabsTrigger value="general" className="flex-1 cursor-pointer">General</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1 cursor-pointer">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <div className="flex flex-col items-center gap-2 relative">
                        <div className="relative w-24 h-24">
                            <img
                                src={preview}
                                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                            />
                            <label
                                htmlFor="image-upload"
                                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition"
                            >
                                <span className="text-white text-sm">Change</span>
                            </label>
                        </div>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                        />
                    </div>

                    <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                    />

                    <Textarea
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={160}
                    />

                    <select
                        className="w-full border rounded p-2 bg-muted text-muted-foreground"
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value as Privacy)}
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>

                    <div className="border-t flex gap-3 shrink-0">
                        <DialogClose nativeButton={false} render={
                            <Button
                                onClick={handleSave}
                                className="flex-1 cursor-pointer"
                                disabled={isLoading}
                            >
                                Save
                            </Button>
                        }/>

                        <DialogClose nativeButton={false} render={<Button
                                variant="outline"
                                className="flex-1 cursor-pointer"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>}/>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4 mt-2">
                    <Input
                        type="password"
                        placeholder="New Password"
                        minLength={6}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="New Password"
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button onClick={handleChangePassword} className="w-full cursor-pointer">
                        Change Password
                    </Button>

                    <Button variant="destructive" onClick={handleLogout} className="w-full cursor-pointer">
                        Logout
                    </Button>
                </TabsContent>
            </Tabs>
        </GeneralModal>
    )
}