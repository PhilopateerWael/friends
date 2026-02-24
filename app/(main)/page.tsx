"use client"

import { useContext } from "react";
import { AppContext } from "../Providers";
import { redirect } from "next/navigation";

export default function Home() {
    const { state, dispatch } = useContext(AppContext);
    
    if(!state.user) {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            Home page
        </div>
    );
}
