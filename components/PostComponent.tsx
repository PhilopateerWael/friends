"use client";

import * as React from "react";
import { Heart, MessageCircle } from "lucide-react";
import { likePostAction, unlikePostAction } from "@/app/actions/posts";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PostType = {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        id: string;
        name: string;
        username?: string | null;
        image: string;
    };
    media: {
        id: string;
        url: string;
        type: "IMAGE" | "VIDEO";
    }[];
    likes: {
        userId: string;
    }[];
    comments: {
        id: string;
    }[];
};

type Props = {
    post: PostType;
    currentUserId: string;
};

export default function PostComponent({ post, currentUserId }: Props) {
    const [likes, setLikes] = React.useState(post.likes);
    const [isLiking, setIsLiking] = React.useState(false);

    const isLiked = likes.some((l) => l.userId === currentUserId);

    async function handleLike() {
        if (isLiking) return;

        setIsLiking(true);

        try {
            if (isLiked) {
                await unlikePostAction(post.id);
                setLikes((prev) => prev.filter((l) => l.userId !== currentUserId));
            } else {
                await likePostAction(post.id);
                setLikes((prev) => [...prev, { userId: currentUserId }]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLiking(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <img
                    src={post.author.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="author"
                />
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                        {post.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                        })}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {post.content && (
                    <p className="whitespace-pre-wrap text-sm">
                        {post.content}
                    </p>
                )}

                {post.media.length > 0 && (
                    <PostMediaGrid media={post.media} />
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        disabled={isLiking}
                        className="flex items-center gap-2"
                    >
                        {isLiking ? (
                            <Spinner />
                        ) : (
                            <Heart
                                className={`w-5 h-5 transition-colors ${isLiked
                                    ? "fill-red-500 text-red-500"
                                    : "text-muted-foreground"
                                    }`}
                            />
                        )}
                        <span className="text-sm">{likes.length}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-muted-foreground"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">
                            {post.comments.length}
                        </span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

type Media = {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
};

function PostMediaGrid({ media }: { media: Media[] }) {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);


    function openViewer(i: number) {
        setIndex(i);
        setOpen(true);
    }

    function next() {
        setIndex((prev) => (prev + 1) % media.length);
    }

    function prev() {
        setIndex((prev) => (prev - 1 + media.length) % media.length);
    }

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <div className="flex gap-2 rounded-lg overflow-hidden h-[400px] max-sm:h-[200px]">
                {media.map((m, i) => {
                    if (i > 1) return null;
                    return (
                        <div
                            key={m.id}
                            className="relative cursor-pointer flex-1"
                            onClick={() => openViewer(i)}
                        >
                            {m.type === "IMAGE" ? (
                                <img
                                    src={m.url}
                                    className="w-full h-full object-contain bg-black/60"
                                    alt=""
                                />
                            ) : (
                                <video
                                    src={m.url}
                                    className="w-full h-full object-contain bg-black/60"
                                />
                            )}

                            {i == 1 && media.length > 2 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-semibold">
                                    +{media.length - 2}
                                </div>
                            )}
                        </div>
                    )

                }
                )}
            </div>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">

                    {/* Backdrop click closes */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setOpen(false)}
                    />

                    {/* Content */}
                    <div className="relative w-full h-full flex items-center justify-center gap-2 p-4">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-white text-lg z-50"
                        >
                            ✕
                        </button>

                        {/* Left Arrow */}
                        <button
                            onClick={prev}
                            className="text-white bg-black/50 p-3 rounded-full z-50"
                        >
                            <ChevronLeft />
                        </button>

                        {/* Media */}
                        <div className="flex-1 flex justify-center items-center">
                            {media[index].type === "IMAGE" ? (
                                <img
                                    src={media[index].url}
                                    className="object-contain"
                                    alt=""
                                />
                            ) : (
                                <video
                                    src={media[index].url}
                                    controls
                                    autoPlay
                                    className="object-contain"
                                />
                            )}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={next}
                            className="text-white bg-black/50 p-3 rounded-full z-50"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}