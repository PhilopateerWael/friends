"use server";

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { User } from "../generated/prisma/client";
import prisma from "@/lib/prisma";


export async function ValidatedAction<T extends z.ZodTypeAny, R>(schema: T, input: z.infer<T>, action: (args: z.infer<T>) => Promise<R>): Promise<{ success: boolean; data: R | null }> {
    const parsed = schema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            data: null
        }
    }

    try {
        const result = await action(parsed.data);

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error("Action failed:", error);
        return {
            success: false,
            data: null
        }
    }
}

export async function ValidatedActionWithAuth<T extends z.ZodTypeAny, R>(schema: T, input: z.infer<T>, action: (user: User, args: z.infer<T>) => Promise<R>): Promise<{ success: boolean; data: R | null }> {
    const parsed = schema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            data: null
        }
    }

    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    try {
        const result = await action(user, parsed.data);

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error("Action failed:", error);

        return {
            success: false,
            data: null
        }
    }
}

export async function AuthenticatedAction<R>(action: (user: User) => Promise<R>): Promise<{ success: boolean; data: R | null }> {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    try {
        const result = await action(user);

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error("Action failed:", error);
        return {
            success: false,
            data: null
        }
    }
}

export async function getUser(): Promise<User | null> {
    try {
        const session = await auth.api.getSession({ headers: await headers() })

        if (!session?.user) return null;

        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id
            },
        });

        return user;
    } catch {
        return null;
    }
}