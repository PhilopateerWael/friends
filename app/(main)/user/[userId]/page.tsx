"use client";

import { getProfileAction } from "@/app/actions/users";

import {
    followAction,
    unfollowAction,
    blockAction,
    unblockAction,
    acceptFollowRequestAction,
    rejectFollowRequestAction,
} from "@/app/actions/users";

import type { Privacy } from "@/app/generated/prisma/client";

import { useAppContext } from "@/app/Providers";
import PostComponent from "@/components/PostComponent";

import EditProfileModal from "@/components/EditProfileModal";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileActions from "@/components/ProfileActions";
import FollowRequestsModal from "@/components/FollowRequestsModal";
import BlockedUsersModal from "@/components/BlockedUsersModal";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { changeBioAction, changePrivacyStatusAction, changeUsernameAction } from "@/app/actions/accountManagement";
import UsersListModal from "@/components/UsersListModal";
import { Block, Post, ProfileUser } from "@/app/types";

const ProfileSkeleton = () => (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
            <CardContent className="flex flex-col items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
            </CardContent>
        </Card>
    </div>
);

export default function Page() {
    const { state, dispatch } = useAppContext();

    const params = useParams();
    const router = useRouter();

    const userId = params.userId as string;

    const [user, setUser] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [canSeePosts, setCanSeePosts] = useState(false);

    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);

    const [followLoading, setFollowLoading] = useState(false);
    const [blockLoading, setBlockLoading] = useState(false);

    const [openRequests, setOpenRequests] = useState(false);
    const [requestsActionLoading, setRequestsActionLoading] = useState(false);
    const [openBlocked, setOpenBlocked] = useState(false);
    const [blockedActionLoading, setBlockedActionLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [privacy, setPrivacy] = useState<Privacy>("PUBLIC");
    const [openFollowers, setOpenFollowers] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);

    const [followersList, setFollowersList] = useState<ProfileUser["followers"][0]["follower"][]>([]);
    const [followingList, setFollowingList] = useState<ProfileUser["followers"][0]["follower"][]>([]);

    const isOwnProfile = state.user?.id === userId;

    const relationship = useMemo(() => {
        if (!state.user) return null;

        const follow = state.user.following?.find(
            (f) => f.followingId === userId
        );

        const block = state.user.blocks?.find(
            (b) => b.blockedId === userId
        );

        return {
            isFollowing: follow?.status === "ACCEPTED",
            isPending: follow?.status === "PENDING",
            isBlocked: !!block,
        };
    }, [state.user, userId]);

    const followRequests = state.user?.followers?.filter((f) => f.status === "PENDING") || [];

    useEffect(() => {
        async function fetchProfile() {
            const res = await getProfileAction(userId);

            if (res) {
                setUser(res.user);
                setCanSeePosts(res.canSeePosts);
                setPosts(res.posts);
                setLikedPosts(res.likedPosts);

                setFollowersList(res.user.followers.filter(x => x.status == "ACCEPTED").map((f) => f.follower));
                setFollowingList(res.user.following.filter(x => x.status == "ACCEPTED").map((f) => f.following));

                if (isOwnProfile) {
                    setUsername(res.user.name);
                    setBio(res.user.bio || " ");
                    setPrivacy(res.user.privacy);
                }
            }

            setLoading(false);
        }

        fetchProfile();
    }, [userId]);

    if (loading) return <ProfileSkeleton />;
    if (!user) return <div className="p-4 text-center">User not found</div>;

    async function handleFollow() {
        if (!state.user) return;

        setFollowLoading(true);

        try {
            if (relationship?.isFollowing || relationship?.isPending) {
                await unfollowAction(userId);

                dispatch({
                    type: "removeFollow",
                    payload: userId,
                });

                followersList && setFollowersList(followersList?.filter((f) => f.id !== state.user!.id));
            } else {
                const res = await followAction(userId);

                if (!res) return;

                dispatch({
                    type: "addFollow",
                    payload: res,
                });

                followersList && setFollowersList([...followersList, res.following]);
            }
        } finally {
            setFollowLoading(false);
        }
    }

    async function handleBlock() {
        if (!state.user) return;

        setBlockLoading(true);

        try {
            if (relationship?.isBlocked) {
                await unblockAction(userId);

                dispatch({
                    type: "removeBlock",
                    payload: userId,
                });
            } else {
                const block = await blockAction(userId);

                dispatch({
                    type: "addBlock",
                    payload: block as Block,
                });

                router.push("/");
            }
        } finally {
            setBlockLoading(false);
        }
    }

    async function handleSave() {
        setEditLoading(true);
        await changeUsernameAction(username);
        await changeBioAction(bio);
        await changePrivacyStatusAction(privacy);

        setUser((prev) =>
            prev ? { ...prev, name: username, bio, privacy } : prev
        );

        dispatch({
            type: "updateProfile",
            payload: {
                name: username,
                bio,
                privacy,
            },
        });

        setOpenEdit(false);
        setEditLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <ProfileHeader
                user={user}
                followersCount={followersList?.length || 0}
                followingCount={followingList?.length || 0}
                onFollowersClick={() => setOpenFollowers(true)}
                onFollowingClick={() => setOpenFollowing(true)}
            />

            <ProfileActions
                isOwnProfile={isOwnProfile}
                relationship={relationship}
                followLoading={followLoading}
                blockLoading={blockLoading}
                handleFollow={handleFollow}
                handleBlock={handleBlock}
                openRequests={() => setOpenRequests(true)}
                openBlocked={() => setOpenBlocked(true)}
                openEdit={() => setOpenEdit(true)}
                privacy={state.user?.privacy}
            />

            <EditProfileModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSave={handleSave}
                username={username}
                setUsername={setUsername}
                bio={bio}
                setBio={setBio}
                privacy={privacy}
                setPrivacy={setPrivacy}
                isLoading={editLoading}
            />

            <UsersListModal
                open={openFollowers}
                onClose={() => setOpenFollowers(false)}
                title="Followers"
                users={followersList}
            />

            <UsersListModal
                open={openFollowing}
                onClose={() => setOpenFollowing(false)}
                title="Following"
                users={followingList}
            />

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
                                        user={state.user!}
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
                            {likedPosts.length ? likedPosts.map((post) => (
                                <PostComponent
                                    key={post.id}
                                    post={post}
                                    user={state.user!}
                                />
                            )) :
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        No Posts To Show.
                                    </CardContent>
                                </Card>
                            }
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

            <FollowRequestsModal
                open={openRequests}
                onClose={() => setOpenRequests(false)}
                requests={followRequests}
                actionLoading={requestsActionLoading}
                onAccept={async (id: string) => {
                    setRequestsActionLoading(true);
                    await acceptFollowRequestAction(id);

                    dispatch({
                        type: "updateFollowers",
                        payload: state.user?.followers.map((f) =>
                            f.id === id ? { ...f, status: "ACCEPTED" } : f
                        ) || [],
                    });
                    
                    setRequestsActionLoading(false);
                }}
                onReject={async (id: string) => {
                    setRequestsActionLoading(true);
                    await rejectFollowRequestAction(id);

                    dispatch({
                        type: "updateFollowers",
                        payload: state.user?.followers.filter((f) => f.id !== id) || [],
                    });

                    setRequestsActionLoading(false);
                }}
            />

            <BlockedUsersModal
                open={openBlocked}
                actionLoading={blockedActionLoading}
                onClose={() => setOpenBlocked(false)}
                blocks={state.user?.blocks || []}
                onUnblock={async (id: string) => {
                    setBlockedActionLoading(true);
                    await unblockAction(id);

                    dispatch({
                        type: "removeBlock",
                        payload: id,
                    });

                    setBlockedActionLoading(false);
                }}
            />
        </div>
    );
}