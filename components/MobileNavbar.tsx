"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import navItems from "@/app/navdata"

export default function MobileNavbar() {
    const pathname = usePathname()
    
    return (
        <div className="flex min-h-screen">
            <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background flex justify-around p-2">
                {navItems.map((item) => (
                    <Button
                        key={item.href}
                        variant="ghost"
                        size="icon"
                        asChild
                        className={cn(
                            pathname === item.href && "text-primary"
                        )}
                    >
                        <Link href={item.href}>
                            <item.icon className="h-6 w-6" />
                        </Link>
                    </Button>
                ))}
            </nav>
        </div>
    )
}