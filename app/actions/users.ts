"use server"

import { targetSchema } from "@/lib/requestSchemas"
import { FollowStatus, Privacy, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { ValidatedActionWithAuth } from "../util/Middleware"


export async function searchUsersAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, searchUsers);
}

export async function getProfileAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, getProfile);
}

export async function followAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, followUser);
}

export async function unfollowAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, unfollowUser);
}

export async function acceptFollowRequestAction(id: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId: id }, acceptFollow);
}

export async function rejectFollowRequestAction(id: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId: id }, rejectFollow);
}

export async function blockAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, blockUser);
}

export async function unblockAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, unblockUser);
}

async function searchUsers(user: User, args: z.infer<typeof targetSchema>) {
    const users = await prisma.user.findMany({
        where: {
            AND: [
                {
                    name: {
                        contains: args.targetId,
                        mode: "insensitive",
                    },
                },
                {
                    blockedBy: {
                        none: {
                            userId: user.id,
                        },
                    },
                },
                {
                    blocks: {
                        none: {
                            blockedId: user.id,
                        },
                    },
                },
                {
                    id: {
                        not: user.id,
                    },
                },
            ],
        },
    })

    return users;
}

async function getProfile(user: User, args: z.infer<typeof targetSchema>) {
    const isSelf = user.id === args.targetId;

    const profile = await getProfileUser(user.id, args.targetId);
    if (!profile) return null;

    const [followersCount, followingsCount] = await Promise.all([
        getFollowersCount(args.targetId),
        getFollowingsCount(args.targetId)
    ]);

    if (isSelf) {
        const [posts, likedPosts] = await Promise.all([
            getPosts(args.targetId),
            getLikedPosts(args.targetId)
        ]);

        return {
            user: profile,
            posts,
            likedPosts,
            canSeePosts: true,
            followersCount,
            followingsCount
        };
    }

    const canSeePosts = await checkCanSeePosts(user.id, args.targetId, profile.privacy);

    if (!canSeePosts) {
        return {
            user: profile,
            posts: [],
            likedPosts: [],
            canSeePosts,
            followersCount,
            followingsCount
        };
    }

    const [posts, likedPosts] = await Promise.all([
        getPosts(args.targetId),
        getLikedPosts(args.targetId)
    ]);

    return {
        user: profile,
        posts,
        likedPosts,
        canSeePosts,
        followersCount,
        followingsCount
    };
}

async function getProfileUser(currentUserId: string, targetId: string) {
    return prisma.user.findFirst({
        where: {
            id: targetId,
            blockedBy: {
                none: { userId: currentUserId }
            },
            blocks: {
                none: { blockedId: currentUserId }
            }
        }, include: {
            followers: {
                include: { follower: true }
            },
            following: {
                include: { following: true }
            },
        }
    });
}

async function getFollowersCount(userId: string) {
    return prisma.follow.count({
        where: {
            followingId: userId,
            status: FollowStatus.ACCEPTED
        }
    });
}

async function getFollowingsCount(userId: string) {
    return prisma.follow.count({
        where: {
            followerId: userId,
            status: FollowStatus.ACCEPTED
        }
    });
}

async function checkCanSeePosts(
    currentUserId: string,
    targetId: string,
    privacy: Privacy
) {
    if (privacy !== Privacy.PRIVATE) return true;

    const isFollower = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetId
            },
            status: FollowStatus.ACCEPTED
        }
    });

    return !!isFollower;
}

async function getPosts(userId: string) {
    return prisma.post.findMany({
        where: {
            author: { id: userId }
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            author: true,
            media: true,
            likes: {
                include: { user: true }
            }
        }
    });
}

async function getLikedPosts(userId: string) {
    return prisma.post.findMany({
        where: {
            likes: {
                some: {
                    userId
                }
            }
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            author: true,
            media: true,
            likes: {
                include: { user: true }
            }
        }
    });
}

async function followUser(user: User, args: z.infer<typeof targetSchema>) {
    const target = await prisma.user.findUnique({
        where: { id: args.targetId }
    });

    if (!target) return null;

    return prisma.follow.create({
        data: {
            followerId: user.id,
            followingId: args.targetId,
            status:
                target.privacy === Privacy.PRIVATE
                    ? FollowStatus.PENDING
                    : FollowStatus.ACCEPTED
        }
    });
}

async function unfollowUser(user: User, args: z.infer<typeof targetSchema>) {
    return prisma.follow.deleteMany({
        where: {
            followerId: user.id,
            followingId: args.targetId
        }
    });
}

async function acceptFollow(user: User, args: z.infer<typeof targetSchema>) {
    return prisma.follow.update({
        where: { id: args.targetId, followingId: user.id },
        data: { status: FollowStatus.ACCEPTED }
    });
}

async function rejectFollow(user: User, args: z.infer<typeof targetSchema>) {
    return prisma.follow.delete({
        where: { id: args.targetId, followingId: user.id }
    });
}

async function blockUser(user: User, args: z.infer<typeof targetSchema>) {
    if (user.id === args.targetId) return "ده احنا كلنا دي كلمه جديدا مثلا";
    
    return prisma.block.create({
        data: {
            userId: user.id,
            blockedId: args.targetId
        },
        include: {
            blocked: true
        }
    });
}

async function unblockUser(user: User, args: z.infer<typeof targetSchema>) {
    return prisma.block.deleteMany({
        where: {
            userId: user.id,
            blockedId: args.targetId
        }
    });
}

// block can throw , follow can throw