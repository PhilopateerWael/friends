"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import navItems from "@/app/navdata"

export default function PcSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen">
            <aside className="hidden md:flex flex-col w-20 border-r items-center py-6 gap-4">
                {navItems.map((item) => (
                    <Button
                        key={item.href}
                        variant="ghost"
                        size="icon"
                        asChild
                        className={cn(
                            pathname === item.href && "bg-muted"
                        )}
                    >
                        <Link href={item.href}>
                            <item.icon className="h-6 w-6" />
                        </Link>
                    </Button>
                ))}
            </aside>
        </div>
    )
}