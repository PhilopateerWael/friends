import { Media } from '@/app/generated/prisma/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const MediaViewer = ({ media, setOpen }: { media: Media[]; setOpen: (open: boolean) => void; }) => {
    const [index, setIndex] = useState(0);

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">

            <div
                className="absolute inset-0"
                onClick={() => setOpen(false)}
            />

            <div className="relative w-full h-full flex items-center justify-center gap-2 p-4">

                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-white text-lg z-50"
                >
                    ✕
                </button>

                <button
                    onClick={() => setIndex((index - 1 + media.length) % media.length)}
                    className="text-white bg-black/50 p-3 rounded-full z-50"
                >
                    <ChevronLeft />
                </button>

                <div className="flex-1 flex justify-center items-center">
                    {media[index].type === "IMAGE" ? (
                        <img
                            src={media[index].url}
                            className="object-contain"
                            alt=""
                        />
                    ) : (
                        <video
                            src={media[index].url}
                            controls
                            autoPlay
                            className="object-contain"
                        />
                    )}
                </div>

                <button
                    onClick={() => setIndex((index + 1) % media.length)}
                    className="text-white bg-black/50 p-3 rounded-full z-50"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    )
}

export default MediaViewer