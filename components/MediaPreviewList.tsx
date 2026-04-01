"use client";

import { X } from "lucide-react";

type MediaFile = {
    file: File;
    preview: string;
};

export default function MediaPreviewList({
    media,
    onRemove,
}: {
    media: MediaFile[];
    onRemove: (index: number) => void;
}) {
    if (!media.length) return null;

    return (
        <div className="flex gap-2 flex-wrap">
            {media.map((m, idx) => (
                <div key={idx} className="relative">
                    {m.file.type.startsWith("image/") ? (
                        <img
                            src={m.preview}
                            className="w-20 h-20 object-cover rounded"
                            alt="preview"
                        />
                    ) : (
                        <video
                            src={m.preview}
                            className="w-20 h-20 object-cover rounded"
                        />
                    )}

                    <button
                        onClick={() => onRemove(idx)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 cursor-pointer rounded-full flex items-center justify-center"
                        type="button"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
}