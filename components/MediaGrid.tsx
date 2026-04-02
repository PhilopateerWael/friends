import { useEffect, useState } from "react";
import MediaViewer from "./MediaViewer";
import { Media } from "@/app/generated/prisma/client";

export default function MediaGrid({ media }: { media: Media[] }) {
    
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    function openViewer(i: number) {
        setIndex(i);
        setOpen(true);
    }

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <div className="flex gap-2 rounded-lg overflow-hidden h-[400px] max-sm:h-[200px]">
                {media.map((m, i) => {
                    if (i > 1) return null;
                    return (
                        <div
                            key={m.id}
                            className="relative cursor-pointer flex-1"
                            onClick={() => openViewer(i)}
                        >
                            {m.type === "IMAGE" ? (
                                <img
                                    src={m.url}
                                    className="w-full h-full object-contain bg-black/60"
                                    alt=""
                                />
                            ) : (
                                <video
                                    src={m.url}
                                    className="w-full h-full object-contain bg-black/60"
                                />
                            )}

                            {i == 1 && media.length > 2 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-semibold">
                                    +{media.length - 2}
                                </div>
                            )}
                        </div>
                    )

                }
                )}
            </div>

            {open && (
                <MediaViewer
                    media={media}
                    setOpen={setOpen}
                />
            )}
        </>
    );
}