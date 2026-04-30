"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { SignInButton } from "./SignInButton";

export function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 inset-x-0 z-50 flex justify-center p-4 md:p-6 transition-all duration-300 pointer-events-none">
            <nav
                className={`pointer-events-auto flex items-center justify-between backdrop-blur-xl bg-[oklch(0.09_0.007_38)]/80 rounded-full transition-all duration-500 ease-out
          ${isScrolled
                        ? "w-full max-w-4xl px-4 py-3.5 border border-white/[0.1] shadow-2xl shadow-black/50"
                        : "w-full max-w-5xl px-6 md:px-8 py-3.5 border border-white/[0.05] shadow-lg shadow-black/20"
                    }
        `}
            >
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className={`rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:bg-orange-600 transition-all duration-300 ${isScrolled ? "w-7 h-7" : "w-8 h-8"}`}>
                        <Flame className={`${isScrolled ? "w-3.5 h-3.5" : "w-4 h-4"} text-white`} />
                    </div>
                    <span className={`font-bold tracking-tight text-white transition-all duration-300 ${isScrolled ? "text-[15px]" : "text-[17px]"}`}>
                        CricArena
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <SignInButton className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all duration-300 text-white font-semibold rounded-full shadow-md shadow-orange-500/20 ${isScrolled ? "text-[12px] px-4 py-1.5" : "text-[13px] px-5 py-2.5"}`}>
                        Get started
                        <ArrowRight className="w-3.5 h-3.5" />
                    </SignInButton>
                </div>
            </nav>
        </div>
    );
}