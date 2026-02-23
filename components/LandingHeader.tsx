import Link from "next/link";
import { Hexagon, Github } from "lucide-react";

export function LandingHeader() {
    return (
        <header className="absolute top-0 left-0 right-0 w-full z-50 flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/100 text-primary">
                    <Hexagon className="absolute animate-[spin_10s_linear_infinite]" size={24} />
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-[0_0_15px_1px_rgba(var(--primary-rgb),0.5)]" />
                </div>
                <span className="text-2xl font-bold tracking-wider text-white font-serif">Moduly</span>
            </div>
            <Link
                href="https://github.com/sammy440/Moduly"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300"
            >
                <Github size={22} />
            </Link>
        </header>
    );
}
