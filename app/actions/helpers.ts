import { FollowStatus, Privacy, type User } from "../generated/prisma/client"

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

export const postDataIncludes = {
    author: true,
    media: true,
    likes: {
        include: {
            user: true
        }
    }
}

export const postConfig = (user: User) => {
    return {
        where: canAccessPost(user),
        include: postDataIncludes
    }
}