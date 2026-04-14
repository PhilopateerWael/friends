import React from 'react'
import { Button } from './ui/button'
import { Paperclip } from 'lucide-react'

const MediaAttacher = ({ handleMediaChange, children }: { handleMediaChange: React.ChangeEventHandler<HTMLInputElement>, children?: React.ReactNode }) => {
    return (
        <Button variant="secondary" size='icon' className="relative cursor-pointer overflow-hidden">
            {children}<Paperclip />
            <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
                className="w-full h-full absolute top-0 cursor-pointer left-0 opacity-0"
            />
        </Button>
    )
}

export default MediaAttacher