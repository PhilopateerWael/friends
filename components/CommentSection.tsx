import { createCommentAction, getCommentsForPostAction } from "@/app/actions/comments"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { MessageCircle } from "lucide-react"
import { Comment } from "@/app/generated/prisma/client"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"

export default function CommentSection({
    postId,
}: any) {
    const [comments, setComments] = useState<Comment[]>([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchComments() {
            try {
                const result = await getCommentsForPostAction(postId);
                setComments(result);
            } catch {

            }
        }

        fetchComments()
    }, [])

    async function submit() {
        if (!text.trim()) return

        setLoading(true)

        try {
            const comment = await createCommentAction(text, postId)

            setComments((prev) => [
                {
                    ...comment,
                    author: comment.author,
                    likes: [],
                },
                ...prev
            ])

            setText("")
        } catch (e) {
            console.error(e)
        }

        setLoading(false)
    }

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{comments.length}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg h-[80vh] flex flex-col p-0 max-sm:h-screen max-sm:rounded-none max-md:max-w-screen">

                <DialogTitle className="px-6 pt-4 shrink-0">
                    Comments
                </DialogTitle>

                <ScrollArea className="flex-1 min-h-0 px-6">
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                </ScrollArea>

                <div className="border-t py-2 px-4 flex gap-2 shrink-0">
                    <Input
                        placeholder="Write a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <Button
                        onClick={submit}
                        disabled={loading}
                    >
                        Post
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}


export function CommentItem({ comment }: any) {
    return (
        <div className="flex gap-3">

            <img
                src={comment.author.image}
                className="w-8 h-8 rounded-full object-cover"
            />

            <div className="flex flex-col gap-1">

                <div className="bg-muted px-3 py-2 rounded-lg text-sm">
                    <span className="font-semibold mr-2">
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
