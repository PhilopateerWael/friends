"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import navItems from "@/app/navdata"
import { useAppContext } from "@/app/Providers"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function MobileNavbar() {
    const pathname = usePathname()
    const { state } = useAppContext()

    return (
        <nav className="md:hidden border-t bg-background flex justify-around p-2">
            {navItems.map((item) => (
                <Button
                    key={item.href}
                    variant="ghost"
                    nativeButton={false}
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
                        `${pathname === item.href && "text-primary"}`
                    }
                />
            ))}
        </nav>
    )
}