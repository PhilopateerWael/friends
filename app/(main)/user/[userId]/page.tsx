"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

const page = () => {
    const params = useParams();
    const userId = params.userId;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canSeePosts, setCanSeePosts] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        
    }, [])

    return (
        <div>
            page for user: {userId}
        </div>
    )
}

export default page