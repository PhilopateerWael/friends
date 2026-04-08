import type { Metadata } from "next"
import PcSidebar from "@/components/PcSidebar"
import MobileNavbar from "@/components/MobileNavbar"
import Providers from "../Providers"
import { ScrollArea } from "@/components/ui/scroll-area";


export const metadata: Metadata = {
    title: "Friends",
    description: "some social media app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="flex h-dvh">
            <Providers>
                <div className="flex w-screen max-md:flex-col">
                    <PcSidebar />
                    <ScrollArea className="h-dvh w-full max-md:h-[calc(100dvh-4rem)]">
                        <main>
                            {children}
                        </main>
                    </ScrollArea>
                    <MobileNavbar />
                </div>
            </Providers>
        </div>
    )
}