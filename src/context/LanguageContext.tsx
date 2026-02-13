"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { en } from "@/locales/en";
import { ta } from "@/locales/ta";

type Language = "en" | "ta";
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
    translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("language") as Language;
        if (saved && (saved === "en" || saved === "ta")) {
            setLanguage(saved);
        }
        setMounted(true);
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "ta" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    // Helper to get nested keys like "nav.home"
    const t = (path: string): string => {
        const keys = path.split(".");
        let current: any = language === "en" ? en : ta;

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Missing translation for ${path} in ${language}`);
                return path;
            }
            current = current[key];
        }
        return current as string;
    };

    const value = {
        language,
        toggleLanguage,
        t,
        translations: language === "en" ? en : ta
    };

    // Always provide context to avoid crashes during SSR
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
