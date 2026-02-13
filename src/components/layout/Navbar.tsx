"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function Navbar() {
    const { t, language, toggleLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    // Simple search state - in a real app this would likely redirect to a search page or filter a list
    const [searchQuery, setSearchQuery] = useState("");

    const navLinks = [
        { href: "/", label: t("nav.home") },
        { href: "/category/sport", label: t("nav.sport") },
        { href: "/category/technology", label: t("nav.technology") },
        { href: "/category/political", label: t("nav.political") },
        { href: "/category/cinema", label: t("nav.cinema") },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="relative h-10 w-40">
                            <Image
                                src="/logo.png"
                                alt="7RealNews Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>
                    <div className="hidden md:flex gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder={t("nav.search")}
                                className="h-9 w-full md:w-[200px] lg:w-[300px] rounded-md border border-input bg-background pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleLanguage}
                        className="w-16 font-semibold"
                    >
                        {language === "en" ? "தமிழ்" : "ENG"}
                    </Button>

                    <ModeToggle />

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        className="md:hidden w-9 h-9 p-0"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t p-4 grid gap-4 bg-background">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium transition-colors hover:text-primary"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/admin"
                        className="text-sm font-medium text-blue-600"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("nav.admin")}
                    </Link>
                </div>
            )}
        </nav>
    );
}
