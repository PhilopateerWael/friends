"use server";

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { User } from "../generated/prisma/client";
import prisma from "@/lib/prisma";


export async function ValidatedAction<T extends z.ZodTypeAny>(schema: T, input: z.infer<T>, action: (args: z.infer<T>) => Promise<any>) {
    const parsed = schema.safeParse(input);

    if (!parsed.success) {
        throw new Error("Invalid input")
    }

    return await action(parsed.data)
}

export async function ValidatedActionWithAuth<T extends z.ZodTypeAny>(schema: T, input: z.infer<T>, action: (user: User, args: z.infer<T>) => Promise<any>) {
    const parsed = schema.safeParse(input);

    if (!parsed.success) {
        throw new Error("Invalid input")
    }

    const userHeaders = await headers();
    const session = await auth.api.getSession({ headers: userHeaders })

    if (!session?.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/login");
    }

    return await action(user, parsed.data);
}

export async function AuthenticatedAction(action: (user: User) => Promise<any>) {
    const userHeaders = await headers();
    const session = await auth.api.getSession({ headers: userHeaders })

    if (!session?.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/login");
    }

    return await action(user);
}