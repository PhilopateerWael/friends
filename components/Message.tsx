import type { Message } from "@/app/types";
import MediaGrid from "./MediaGrid";

export default function Message({
    msg,
    isOwn,
}: {
    msg: Message;
    isOwn: boolean;
}) {
    return (
        <div
            className={`p-2 rounded-lg w-fit max-w-[70%] ${isOwn ? "ml-auto bg-primary text-black" : "bg-muted"
                }`}
        >
            {msg.content && <div className="mb-1">{msg.content}</div>}

            {msg.media?.length > 0 && (
                <div className="flex flex-col gap-2">
                    <MediaGrid media={msg.media}/>
                </div>
            )}
        </div>
    );
}