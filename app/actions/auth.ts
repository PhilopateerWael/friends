"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ValidatedAction } from "../util/Middleware";
import { signInSchema, signUpSchema } from "@/lib/requestSchemas";
import z from "zod";
import { User } from "../generated/prisma/client";
import prisma from "@/lib/prisma";

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

    redirect("/")
}

export async function getMeAction(): Promise<User | null> {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) return null;

    const user = await prisma.user.findUnique({
        where: {
            id: session?.user.id
        }
    });

    return user;
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