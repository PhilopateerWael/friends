"use client"

import PostWriter from "@/components/PostWriter";
import { useAppContext } from "../Providers";
import { useEffect, useState } from "react";
import { getFeedAction } from "../actions/posts";
import PostComponent from "@/components/PostComponent";
import UsersSearch from "@/components/UsersSearch";
import { Post } from "../types";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import PostSkeletons from "@/components/PostSkeletons";

export default function Home() {
    const { state } = useAppContext();
    const [feed, setFeed] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         // const { success, data } = await getFeedAction()

    //         // setLoading(false)

    //         // if (success) {
    //         //     setFeed(data!);
    //         // } else {
    //         //     setFeed([]);
    //         //     toast.error("Failed to fetch feed");
    //         // }
    //     }

    //     fetchPosts();
    // }, [])

    return (
        <div className="flex flex-col px-3 py-6 gap-4 items-center">
            <UsersSearch isAbsolute={true} action={(x) => redirect("/user/" + x.id)} actionLoading={false} />
            <PostWriter setFeed={setFeed} />
            {
                loading ? <PostSkeletons />
                    :
                    feed.map((post: Post) => (
                        <PostComponent
                            key={post?.id}
                            post={post}
                        />
                    ))
            }
            <div className="h-64"></div>
        </div>
    );
}
