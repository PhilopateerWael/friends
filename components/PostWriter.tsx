"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "./ui/spinner";
import { createPostAction } from "@/app/actions/posts";
import { toast } from "sonner";
import MediaAttacher from "./MediaAttacher";
import MediaPreviewList from "./MediaPreviewList";

type MediaFile = {
    file: File;
    preview: string;
};

export default function PostWriter({ setFeed }: { setFeed: React.Dispatch<React.SetStateAction<any[]>> }) {
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

        e.target.value = "";
        setMedia(prev => [...prev, ...filesArray]);
    };

    const handleRemoveMedia = (index: number) => {
        setMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const MAX_TOTAL = 10 * 1024 * 1024;

        const totalSize = media.reduce((acc, m) => acc + m.file.size, 0);

        if (totalSize > MAX_TOTAL) {
            toast.error("Media is too large. Maximum upload is 10MB.");
            setLoading(false);
            return;
        }

        const response = await createPostAction(text, media.map(m => m.file));

        if (response.success) {
            setText("");
            setMedia([]);

            toast.success("Post created successfully!");

            setFeed((prev) => [response.data, ...prev]);
        } else {
            toast.error("Failed to create post.");
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
                        <MediaPreviewList media={media} onRemove={handleRemoveMedia} />
                    </div>
                    <MediaAttacher handleMediaChange={handleMediaChange}>Attach Media</MediaAttacher>
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