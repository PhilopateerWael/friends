"use client"

import PostWriter from "@/components/PostWriter";
import { useAppContext } from "../Providers";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getFeedAction } from "../actions/posts";
import PostComponent from "@/components/PostComponent";

export default function Home() {
    const { state } = useAppContext();
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const x = await getFeedAction()
            setFeed(x)
        }

        fetchPosts();
    }, [])

    if (!state.user) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col px-3 py-6 gap-4">
            <PostWriter />
            {feed.map((post : any) => (
                <PostComponent
                    key={post?.id}
                    post={post}
                    currentUserId={state?.user?.id || ""}
                />
            ))}
        </div>
    );
}
