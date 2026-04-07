"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthenticatedAction, ValidatedAction } from "../util/Middleware";
import { signInSchema, signUpSchema } from "@/lib/requestSchemas";
import z from "zod";
import { User } from "../generated/prisma/client";
import ably from "@/lib/ably";
import { TokenDetails } from "ably";
import prisma from "@/lib/prisma";
import { UserPopulated } from "../types";
import { populatedUserIncludes } from "./helpers";

export async function signUpAction(email: string, password: string, name: string) {
    return await ValidatedAction(signUpSchema, { email, password, name: name }, signUp);
}

export async function signInAction(email: string, password: string) {
    return await ValidatedAction(signInSchema, { email, password }, signIn);
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers()
    });

    redirect("/login")
}

export async function getMeAction() {
    return await AuthenticatedAction(getMe);
}

export async function getAblyTokenAction() {
    return await AuthenticatedAction(getAblyToken);
}

async function getMe(user: User): Promise<{ user: UserPopulated | null; token: TokenDetails }> {
    const userPopulated = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: populatedUserIncludes
    });

    const token = await ably.auth.requestToken({
        clientId: user.id,
        capability: {
            [`user-${user.id}`]: ["subscribe"],
        }
    })

    return { user: userPopulated, token };
}

async function getAblyToken(user: User): Promise<TokenDetails> {
    const token = await ably.auth.requestToken({
        clientId: user.id,
        capability: {
            [`user-${user.id}`]: ["subscribe"]
        }
    })

    return token;
}

async function signIn(args: z.infer<typeof signInSchema>) {
    await auth.api.signInEmail({
        body: {
            email: args.email,
            password: args.password,
        }
    });
}

async function signUp(args: z.infer<typeof signUpSchema>) {
    await auth.api.signUpEmail({
        body: {
            email: args.email,
            password: args.password,
            name: args.name,
        }
    });
}
