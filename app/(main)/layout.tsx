import type { Metadata } from "next"
import PcSidebar from "@/components/PcSidebar"
import MobileNavbar from "@/components/MobileNavbar"
import Providers from "../Providers"

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
        <div className="flex">
            <Providers>
                <PcSidebar />

                <main className="flex-1 max-md:h-[calc(100vh-4rem)]">
                    {children}
                </main>

                <MobileNavbar />
            </Providers>
        </div>
    )
}