import { createCommentAction, getCommentsForPostAction } from "@/app/actions/comments"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import type { Comment } from "@/app/types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { CommentComponent } from "./CommentComponent"
export default function CommentSection({
    postId,
}: {
    postId: string;
}) {
    const [comments, setComments] = useState<Comment[]>([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchComments() {
            const { success, data } = await getCommentsForPostAction(postId);

            if (success)
                setComments(data!);
            else
                toast.error("Failed to load comments");
        }

        fetchComments()
    }, [])

    async function submit() {
        if (!text.trim()) return

        setLoading(true)

        const { success, data } = await createCommentAction(text, postId)

        if (success) {
            const comment = data!

            setComments((prev) => [
                {
                    ...(comment),
                },
                ...prev
            ])
        } else {
            toast.error("Failed to post comment")
        }


        setText("")
        setLoading(false)
    }

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground cursor-pointer flex-1"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{comments.length}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[70vh] flex flex-col p-0">

                <DialogTitle className="px-6 pt-4 shrink-0">
                    Comments
                </DialogTitle>

                <ScrollArea className="flex-1 min-h-0 px-6">
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <CommentComponent key={comment.id} comment={comment} />
                        ))}
                    </div>
                </ScrollArea>

                <div className="border-t py-2 px-4 flex gap-2 shrink-0">
                    <Input
                        placeholder="Write a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                submit();
                            }
                        }}
                    />

                    <Button
                        onClick={submit}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        Post
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

