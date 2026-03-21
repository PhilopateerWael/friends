"use server"

import { targetSchema } from "@/lib/requestSchemas"
import { FollowStatus, Privacy, User } from "../generated/prisma/client"
import z from "zod"
import prisma from "@/lib/prisma"
import { ValidatedActionWithAuth } from "../util/Middleware"


export async function searchUsersAction(targetId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId }, searchUsers);
}

export async function getProfileAction(userId: string) {
    return await ValidatedActionWithAuth(targetSchema, { targetId: userId }, getProfile);
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
    const profile = await prisma.user.findUnique({
        where: {
            id: args.targetId,
        }
    })

    const blockExists = await prisma.block.findFirst({
        where: {
            OR: [
                {
                    userId: user.id,
                    blockedId: args.targetId,
                },
                {
                    userId: args.targetId,
                    blockedId: user.id,
                }
            ]
        }
    })

    if (blockExists) {

    }

    let canSeePosts = true;

    if (profile?.privacy === Privacy.PRIVATE) {
        if (profile?.privacy === Privacy.PRIVATE) {
            const isFollower = await prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: user.id,
                        followingId: args.targetId,
                    },
                    status : FollowStatus.ACCEPTED,
                }
            });

            if (!isFollower) {
                canSeePosts = false;
            }
        }
    }
    
    let posts = [];

    if(canSeePosts){

    }


}