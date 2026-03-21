"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthenticatedAction, getUser, ValidatedAction } from "../util/Middleware";
import { signInSchema, signUpSchema } from "@/lib/requestSchemas";
import z from "zod";
import { User } from "../generated/prisma/client";
import ably from "@/lib/ably";
import { TokenDetails } from "ably";

export async function signUpAction(email: string, password: string, name: string) {
    return await ValidatedAction(signUpSchema, { email, password, username: name }, signUp);
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

export async function getMeAction(): Promise<{ user: User; token: TokenDetails } | { user: null; token: null }> {
    return await AuthenticatedAction(getMe);
}

export async function getAblyTokenAction(): Promise<TokenDetails> {
    return await AuthenticatedAction(getAblyToken);
}

async function getMe(user: User): Promise<{ user: User; token: TokenDetails } | { user: null; token: null }> {
    const token = await ably.auth.requestToken({
        clientId: user.id,
        capability: {
            [`user-${user.id}`]: ["subscribe"]
        }
    })

    return { user, token };
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
    try {
        await auth.api.signInEmail({
            body: {
                email: args.email,
                password: args.password,
            }
        });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Invalid credentials"
        };
    }
}

async function signUp(args: z.infer<typeof signUpSchema>) {
    try {
        await auth.api.signUpEmail({
            body: {
                email: args.email,
                password: args.password,
                name: args.username
            }
        });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to create account"
        };
    }
}
