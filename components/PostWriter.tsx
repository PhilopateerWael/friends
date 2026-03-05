"use client";

import * as React from "react";
import { useState } from "react";
import { Paperclip } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "./ui/spinner";
import { createPostAction } from "@/app/actions/posts";
import { toast } from "sonner";

type MediaFile = {
    file: File;
    preview: string;
};

export default function PostWriter() {
    const [text, setText] = useState("");
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(false);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files)
            .filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"))
            .map(file => ({
                file,
                preview: URL.createObjectURL(file),
            }));

        setMedia(prev => [...prev, ...filesArray]);
    };

    const handleRemoveMedia = (index: number) => {
        setMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const response = await createPostAction(text, media.map(m => m.file));
        console.log(response)
        if (response.success) {
            setText("");
            setMedia([]);
            toast.success("Post created successfully!");
        } else {
            toast.error("Failed to create post: " + response.error);
        }
        setLoading(false);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create a Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Textarea
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="resize-none"
                />

                <div className="flex flex-col">
                    <div className="flex gap-2 flex-wrap">
                        {media.map((m, idx) => (
                            <div key={idx} className="relative">
                                {m.file.type.startsWith("image/") ? (
                                    <img src={m.preview} className="w-24 h-24 object-cover rounded" alt="preview" />
                                ) : (
                                    <video src={m.preview} className="w-24 h-24 object-cover rounded" controls />
                                )}
                                <button
                                    onClick={() => handleRemoveMedia(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    type="button"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button variant="secondary" className="mt-2 w-full relative cursor-pointer overflow-hidden">
                        Attach Media <Paperclip />
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleMediaChange}
                            className="w-full h-full absolute top-0  cursor-pointer left-0 opacity-0"
                        />
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={(!text && media.length === 0) || loading} className="cursor-pointer w-full">
                    {loading ? <Spinner /> : "Post"}
                </Button>
            </CardFooter>
        </Card>
    );
}