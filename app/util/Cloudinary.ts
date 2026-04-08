"use server";

import cloudinary from "@/lib/cloudinary";
import { MediaType } from "../generated/prisma/browser";

export async function processMedia(file: File): Promise<{ url: string, type: MediaType }> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "friends", resource_type: "auto" },
            (err, result) => {
                if (err) return reject(err);
                resolve({
                    url: result!.secure_url,
                    type: file.type.startsWith("image/") ? MediaType.IMAGE : MediaType.VIDEO,
                });
            }
        );

        stream.end(buffer);
    });
}
