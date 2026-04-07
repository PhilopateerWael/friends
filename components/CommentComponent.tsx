import { Comment } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export function CommentComponent({ comment }: { comment: Comment }) {
    return (
        <div className="flex gap-3">

            <Avatar
                onClick={() => redirect("/user/" + comment.author.id)}
                className="w-8 h-8 cursor-pointer"
            >
                <AvatarImage src={comment.author.image} />
                <AvatarFallback>
                    {comment.author.name?.[0]}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">

                <div className="bg-muted px-3 py-2 rounded-lg text-sm">
                    <span className="font-semibold mr-2 cursor-pointer" onClick={() => redirect("/user/" + comment.author.id)}>
                        {comment.author.name}
                    </span>

                    {comment.content}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                        })}
                    </span>
                </div>
            </div>
        </div>
    )
}
