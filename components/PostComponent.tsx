"use client";

import { Heart } from "lucide-react";
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
import { useState } from "react";
import { Media, Post, User } from "@/app/generated/prisma/client";
import MediaGrid from "./MediaGrid";
import CommentSection from "./CommentSection";

type Props = {
    post: Post & { media: Media[] } & { comments: Comment[] } & { likes: { user: User }[] } & { author: User };
    user: User;
};

export default function PostComponent({ post, user }: Props) {
    const [likes, setLikes] = useState(post.likes);
    const [isLiking, setIsLiking] = useState(false);
    const isLiked = likes.some((l) => l.user.id === user.id);

    async function handleLike() {
        if (isLiking) return;

        setIsLiking(true);

        try {
            if (isLiked) {
                await unlikePostAction(post.id);
                setLikes((prev) => prev.filter((l) => l.user.id !== user.id));
            } else {
                await likePostAction(post.id);
                setLikes((prev) => [...prev, { user: user }]);
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
                    <MediaGrid media={post.media} />
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
                    <CommentSection
                        postId={post.id}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
