import { Media } from '@/app/generated/prisma/client'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button';

const MediaViewer = ({ media, setOpen }: { media: Media[]; setOpen: (open: boolean) => void; }) => {
    const [index, setIndex] = useState(0);

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">

            <div
                className="absolute inset-0"
                onClick={() => setOpen(false)}
            />

            <div className="relative w-full h-full flex items-center justify-center gap-2 p-4">

                <Button
                    variant={"outline"}
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-white bg-muted p-3 rounded-full z-50 cursor-pointer flex items-center justify-center"
                >
                    <X size={20} />
                </Button>

                <Button
                    onClick={() => setIndex((index - 1 + media.length) % media.length)}
                    className="text-white bg-muted p-3 rounded-full z-50 cursor-pointer"
                    disabled={media.length <= 1}
                    variant={"outline"}
                >
                    <ChevronLeft />
                </Button>

                <div className="flex-1 flex justify-center items-center overflow-hidden h-dvh">
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

                <Button
                    onClick={() => setIndex((index + 1) % media.length)}
                    className="text-white bg-muted p-3 rounded-full z-50 cursor-pointer"
                    disabled={media.length <= 1}
                    variant={"outline"}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    )
}

export default MediaViewer