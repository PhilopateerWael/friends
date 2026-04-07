"use client";

import { getProfileAction } from "@/app/actions/users";
import { useAppContext } from "@/app/Providers";
import PostComponent from "@/components/PostComponent";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileActions from "@/components/ProfileActions";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "@/app/types";
import { User } from "@/app/generated/prisma/browser";
import ProfileSkeleton from "@/components/ProfileSkeleton";

export default function Page() {
    const { state } = useAppContext();
    const params = useParams();

    const userId = params.userId as string;

    const [loading, setLoading] = useState(true);
    const [canSeePosts, setCanSeePosts] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [followersList, setFollowersList] = useState<User[]>([]);
    const [followingsList, setFollowingsList] = useState<User[]>([]);

    useEffect(() => {
        async function fetchProfile() {
            const { success, data } = await getProfileAction(userId);

            if (success) {
                setUser(data!.user);
                setCanSeePosts(data!.canSeePosts);
                setPosts(data!.posts);
                setLikedPosts(data!.likedPosts);
                setFollowersList(data!.followersList.map(f => f.follower));
                setFollowingsList(data!.followingsList.map(f => f.following));
            }else{
                redirect("/")
            }

            setLoading(false);
        }

        fetchProfile();
    }, [userId]);

    if (loading) return <ProfileSkeleton />;
    
    if (!user) return <div className="p-4 text-center">User not found</div>;

    const truthSource = state.user?.id === user.id ? state.user : user;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">

            <ProfileHeader followersList={followersList} follwingList={followingsList} user={truthSource} />
            <ProfileActions user={truthSource} />
           
            {canSeePosts ? (
                <Tabs defaultValue="posts">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="liked">Liked</TabsTrigger>
                    </TabsList>

                    <Separator className="my-2" />

                    <TabsContent value="posts">
                        <div className="space-y-4">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostComponent
                                        key={post.id}
                                        post={post}
                                    />
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        No Posts To Show.
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="liked">
                        <div className="space-y-4">
                            {likedPosts.length ? (
                                likedPosts.map((post) => (
                                    <PostComponent
                                        key={post.id}
                                        post={post}
                                    />
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        No Posts To Show.
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        This account is private
                    </CardContent>
                </Card>
            )}
        </div>
    );
}