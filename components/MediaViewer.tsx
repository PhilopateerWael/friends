import { Media } from '@/app/generated/prisma/client'
import { ChevronLeft, ChevronRight , X } from 'lucide-react'
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
                    className="absolute top-4 right-4 text-white bg-muted p-3 rounded-full z-50 cursor-pointer flex items-center justify-center"
                >
                    <X size={20}/>
                </button>

                <button
                    onClick={() => setIndex((index - 1 + media.length) % media.length)}
                    className="text-white bg-muted p-3 rounded-full z-50 cursor-pointer"
                >
                    <ChevronLeft />
                </button>

                <div className="flex-1 flex justify-center items-center overflow-hidden h-screen">
                    {media[index].type === "IMAGE" ? (
                        <img
                            src={media[index].url}
                            className="max-w-full max-h-full object-contain"
                            alt=""
                        />
                    ) : (
                        <video
                            src={media[index].url}
                            controls
                            autoPlay
                            className="max-w-full max-h-full object-contain"
                        />
                    )}
                </div>

                <button
                    onClick={() => setIndex((index + 1) % media.length)}
                    className="text-white bg-muted p-3 rounded-full z-50 cursor-pointer"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    )
}

export default MediaViewer