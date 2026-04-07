"use server"

import prisma from "@/lib/prisma"
import { User } from "../generated/prisma/client";
import { processMedia } from "../util/Cloudinary";
import { editProfileSchema } from "@/lib/requestSchemas";
import z from "zod";
import { populatedUserIncludes } from "./helpers";
import { ValidatedActionWithAuth } from "../util/Middleware";

export async function editProfileAction(args: z.infer<typeof editProfileSchema>) {
    return await ValidatedActionWithAuth(editProfileSchema, args, editProfile);
}

async function editProfile(user: User, args: z.infer<typeof editProfileSchema>) {
    let image = user.image;

    if (args.image) {
        try {
            const result = await processMedia(args.image);
            image = result.url;
        } catch (error) {
            console.error("Error processing media:", error);
            throw new Error("Failed to upload image");
        }
    }
    
    return await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            name: args.name,
            bio: args.bio,
            image: image,
            privacy: args.privacy
        },
        include: populatedUserIncludes
    });
}