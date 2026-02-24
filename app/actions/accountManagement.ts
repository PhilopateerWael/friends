"use server"

import { ValidatedActionWithAuth } from "../util/Middleware"
import prisma from "@/lib/prisma"
import { bioSchema, privacySchema, usernameSchema } from "@/lib/requestSchemas"
import { Privacy } from "../generated/prisma/enums";
import z from "zod";

export async function changeUsernameAction(username: string) {
    return ValidatedActionWithAuth(usernameSchema, { username }, changeUsername);
};

export async function changeBioAction(bio: string) {
    return ValidatedActionWithAuth(bioSchema, { bio }, changeBio);
};

export async function changePrivacyStatusAction(privacy: Privacy) {
    return ValidatedActionWithAuth(privacySchema, { privacy }, changePrivacyStatus);
};

async function changeBio(user: any, args: z.infer<typeof bioSchema>) {
    await prisma.user.update({
        where: { id: user.id },
        data: { bio: args.bio }
    })
}

async function changePrivacyStatus(user: any, args: z.infer<typeof privacySchema>) {
    await prisma.user.update({
        where: { id: user.id },
        data: { privacy: args.privacy }
    });
}

async function changeUsername(user: any, args: z.infer<typeof usernameSchema>) {
    const name = args.username;

    await prisma.user.update({
        where: { id: user.id },
        data: { name }
    });
}
