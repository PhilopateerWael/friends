"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function GeneralModal({ title, children, trigger, footer }: { title: string, children: React.ReactNode, trigger: React.ReactElement, footer?: React.ReactNode }) {

    return (
        <Dialog>
            <DialogTrigger render={trigger}/>

            <DialogContent className="flex flex-col">
                <DialogTitle>{title}</DialogTitle>
                <ScrollArea className="max-h-fit h-[70dvh]">
                    {children}
                </ScrollArea>
                {footer}
            </DialogContent>
        </Dialog>
    );
}