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
        <div className="flex min-h-dvh">
            <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background flex justify-around p-2">
                {navItems.map((item) => (
                    <Button
                        key={item.href}
                        variant="ghost"
                        size="icon"
                        asChild
                        className={
                            `${pathname === item.href && "text-primary"}`
                        }
                    >
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
                    </Button>
                ))}
            </nav>
        </div>
    )
}