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
import { useEffect, useState } from "react";
import MediaGrid from "./MediaGrid";
import CommentSection from "./CommentSection";
import { redirect } from "next/navigation";
import type { Post } from "@/app/types";
import { User } from "@/app/generated/prisma/client";
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/components/ui/avatar";
import { useAppContext } from "@/app/Providers";
import { toast } from "sonner";
import UsersListModal from "./UsersListModal";

type Props = {
    post: Post;
};

export default function PostComponent({ post }: Props) {
    const { state, dispatch } = useAppContext();
    const user = state.user as User;
    const [likes, setLikes] = useState(post.likes);
    const [isLiking, setIsLiking] = useState(false);
    const isLiked = likes.some((l) => l.user.id === user.id);

    async function handleLike() {
        if (isLiking) return;

        setIsLiking(true);

        if (isLiked) {
            const { success } = await unlikePostAction(post.id);
            if (success)
                setLikes((prev) => prev.filter((l) => l.user.id !== user.id));
            else
                toast.error("Failed to unlike post.");
        } else {
            const { success, data } = await likePostAction(post.id);
            if (success)
                setLikes((prev) => [...prev, data!]);
            else
                toast.error("Failed to like post.");
        }

        setIsLiking(false);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 cursor-pointer" onClick={() => redirect(`/user/${post.author.id}`)}>
                <Avatar
                    className="cursor-pointer"
                >
                    <AvatarImage src={post.author.image} />
                    <AvatarFallback>
                        {post.author.name?.[0]}
                    </AvatarFallback>
                </Avatar>
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

            <CardFooter className="flex flex-col gap-2 items-start">
                {likes.length > 0 && (
                    <div className="flex items-center justify-between w-full">
                        <AvatarGroup>
                            {likes.slice(0, 5).map((like) => (
                                <Avatar key={like.id} className="w-6 h-6">
                                    <AvatarImage src={like.user.image} />
                                    <AvatarFallback>
                                        {like.user.name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            ))}

                            {likes.length > 5 && (
                                <AvatarGroupCount className="text-xs h-6 w-6">
                                    +{likes.length - 5}
                                </AvatarGroupCount>
                            )}
                        </AvatarGroup>

                        <UsersListModal users={likes.map((like) => like.user)} title="Likes">
                            <span className="text-xs text-muted-foreground hover:underline cursor-pointer">
                                {likes.length} like{likes.length > 1 && "s"}
                            </span>
                        </UsersListModal>
                    </div>
                )}
                <div className="flex w-full">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        disabled={isLiking}
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
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
                    </Button>

                    <CommentSection
                        commentsData={post.comments}
                        postId={post.id}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
