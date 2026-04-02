"use server"

import { ValidatedActionWithAuth } from "../util/Middleware"
import prisma from "@/lib/prisma"
import { bioSchema, privacySchema, usernameSchema } from "@/lib/requestSchemas"
import { FollowStatus, Privacy } from "../generated/prisma/enums";
import z from "zod";
import { User } from "../generated/prisma/client";

export async function changeUsernameAction(username: string) {
    return ValidatedActionWithAuth(usernameSchema, { username }, changeUsername);
};

export async function changeBioAction(bio: string) {
    return ValidatedActionWithAuth(bioSchema, { bio }, changeBio);
};

export async function changePrivacyStatusAction(privacy: Privacy) {
    return ValidatedActionWithAuth(privacySchema, { privacy }, changePrivacyStatus);
};

async function changeBio(user : User, args: z.infer<typeof bioSchema>) {
    await prisma.user.update({
        where: { id: user.id },
        data: { bio: args.bio }
    })
}

async function changePrivacyStatus(user: User, args: z.infer<typeof privacySchema>) {
    if(args.privacy === Privacy.PUBLIC){
        await prisma.follow.updateMany({
            where : {
                followingId : user.id,
                status : FollowStatus.PENDING
            },
            data : {
                status : FollowStatus.ACCEPTED
            }
        })
    } 

    await prisma.user.update({
        where: { id: user.id },
        data: { privacy: args.privacy }
    });
}

async function changeUsername(user: User, args: z.infer<typeof usernameSchema>) {
    const name = args.username;

    await prisma.user.update({
        where: { id: user.id },
        data: { name }
    });
}
