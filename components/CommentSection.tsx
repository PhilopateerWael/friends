import { createCommentAction } from "@/app/actions/comments"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"
import type { Comment } from "@/app/types"
import { CommentComponent } from "./CommentComponent"
import GeneralModal from "./GeneralModal"
export default function CommentSection({
    postId,
    commentsData
}: {
    commentsData: Comment[];
    postId: string;
}) {
    const [comments, setComments] = useState<Comment[]>(commentsData || [])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

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
        <GeneralModal title="Comments"
            trigger={
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground cursor-pointer flex-1"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{comments.length}</span>
                </Button>
            }
            footer={
                <div className="flex gap-2 shrink-0">
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
                        className="flex-1 rounded-full bg-muted border-0 px-4 text-sm focus-visible:ring-1"
                    />

                    <Button
                        onClick={submit}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        Post
                    </Button>
                </div>
            }
        >
            {comments.length ?
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentComponent key={comment.id} comment={comment} />
                    ))}
                </div> :
                (
                    <p className="text-muted-foreground text-center">
                        No comments yet
                    </p>
                )}
        </GeneralModal>
    )
}