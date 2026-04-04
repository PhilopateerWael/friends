"use client"

import PostWriter from "@/components/PostWriter";
import { useAppContext } from "../Providers";
import { useEffect, useState } from "react";
import { getFeedAction } from "../actions/posts";
import PostComponent from "@/components/PostComponent";
import UsersSearch from "@/components/UsersSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "../types";
import { redirect } from "next/navigation";

export default function Home() {
    const { state } = useAppContext();
    const [feed, setFeed] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const x = await getFeedAction()
            setFeed(x)
            setLoading(false)
        }

        fetchPosts();
    }, [])

    return (
        <div className="flex flex-col px-3 py-6 gap-4 items-center">
            <UsersSearch isAbsolute={true} action={(x) => redirect("/user/" + x.id)} actionLoading={false} />
            <PostWriter setFeed={setFeed} />
            {loading ?
                [1, 2, 3].map((i) => (
                    <Card key={i} className="w-full max-w-2xl mx-auto">
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-56 w-full" />
                        </CardContent>
                    </Card>
                ))
                : feed.map((post: Post) => (
                    <PostComponent
                        key={post?.id}
                        post={post}
                        user={state.user!}
                    />
                ))}
        </div>
    );
}
