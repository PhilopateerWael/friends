import { FollowStatus, Prisma, Privacy, type User } from "../generated/prisma/client"

export function canAccessPost(user: User) {
    return {
        AND: [
            {
                author: {
                    blocks: {
                        none: {
                            blockedId: user.id
                        }
                    }
                }
            },
            {
                author: {
                    blockedBy: {
                        none: {
                            userId: user.id
                        }
                    }
                }
            },
            {
                OR: [
                    {
                        author: {
                            privacy: Privacy.PUBLIC
                        }
                    },
                    {
                        author: {
                            privacy: Privacy.PRIVATE,
                            followers: {
                                some: {
                                    followerId: user.id,
                                    status: FollowStatus.ACCEPTED
                                }
                            }
                        }
                    },
                    {
                        author: {
                            id: user.id
                        }
                    }
                ]
            }
        ]
    }
}

export const postConfig = (user: User) => {
    return {
        where: canAccessPost(user),
        include: postIncludes
    }
}

export const messageIncludes = {
    sender: true,
    media: true
}

export const chatIncludes = {
    participants: {
        include: {
            user: true
        }
    }
}

export const postIncludes = {
    author: true,
    media: true,
    likes: {
        include: {
            user: true
        }
    }
}

export const populatedUserIncludes = {
    followers: { include: { follower: true } },
    blocks: { include: { blocked: true } },
    following: { include: { following: true } },
    participant: {
        include: {
            chat: {
                include: {
                    participants: {
                        include: { user: true }
                    }
                }
            }
        }
    }
}