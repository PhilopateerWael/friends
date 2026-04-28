"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import navItems from "@/app/navdata"
import { useAppContext } from "@/app/Providers"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function PcSidebar() {
    const pathname = usePathname()
    const { state } = useAppContext()

    return (
        <aside className="hidden md:flex flex-col h-dvh sticky top-0 w-20 border-r items-center justify-center py-6 gap-4">
            {navItems.map((item) => (
                <Button
                    key={item.href}
                    nativeButton={false}
                    variant="ghost"
                    size="icon"
                    render={
                        <Link href={item.href == "/profile" ? `/user/${state?.user?.id}` : item.href}>
                        {item.href == "/profile" ? (
                            <Avatar
                                className="w-8 h-8 cursor-pointer"
                            >
                                <AvatarImage src={state?.user?.image} />
                                <AvatarFallback>
                                    {state?.user?.name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <item.icon className="h-6 w-6" />
                        )}
                    </Link>
                    }
                    className={
                        `${pathname === item.href && "bg-muted"}`
                    }
                />
            ))}
        </aside>
    )
}