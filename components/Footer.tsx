import { Terminal, Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full relative bg-background border-t border-white/10 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-5 flex flex-col items-start gap-6">
                        <Link href="/" className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Terminal className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-serif text-2xl tracking-wide">Moduly</span>
                        </Link>
                        <p className="text-white/50 text-base max-w-sm leading-relaxed">
                            Elevate your developer experience with high-end, interactive architecture maps and dependency visualizations.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="#" className="p-2.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Group 1 */}
                    <div className="col-span-1 md:col-span-7 flex flex-col items-start md:items-end gap-4 mt-8 md:mt-0">
                        <h4 className="text-white font-medium text-sm tracking-widest uppercase mb-2">Product</h4>
                        <Link href="/product#features" className="text-white/50 hover:text-primary transition-colors flex items-center md:flex-row-reverse gap-2 group w-max">
                            Features
                            <ArrowUpRight className="w-3 h-3 opacity-0 translate-y-1 md:-translate-y-1 -translate-x-1 md:translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                        </Link>
                        <Link href="/product#cli" className="text-white/50 hover:text-primary transition-colors flex items-center md:flex-row-reverse gap-2 group w-max">
                            CLI Tool
                            <ArrowUpRight className="w-3 h-3 opacity-0 translate-y-1 md:-translate-y-1 -translate-x-1 md:translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                        </Link>
                        <Link href="/product#docs" className="text-white/50 hover:text-primary transition-colors flex items-center md:flex-row-reverse gap-2 group w-max">
                            Documentation
                            <ArrowUpRight className="w-3 h-3 opacity-0 translate-y-1 md:-translate-y-1 -translate-x-1 md:translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                    <p>© {currentYear} Moduly. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
