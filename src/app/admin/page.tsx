"use client";

import { useState } from "react";
import { NewsForm } from "@/components/admin/NewsForm";
import { AdManager } from "@/components/admin/AdManager";
import { PostList } from "@/components/admin/PostList";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Megaphone } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"upload" | "history" | "ads">("upload");

    const tabs = [
        { id: "upload", label: t("admin.upload_news"), icon: PlusCircle },
        { id: "history", label: t("admin.post_history"), icon: List },
        { id: "ads", label: t("ads.management"), icon: Megaphone },
    ];

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t("admin.title")}
                    </h1>
                    <p className="text-muted-foreground text-lg">Manage your news content and advertisements.</p>
                </div>

                <div className="flex bg-muted/50 p-1.5 rounded-xl shadow-inner">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="transition-all duration-300 min-h-[500px]">
                {activeTab === "upload" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <NewsForm onSuccess={() => setActiveTab("history")} />
                    </div>
                )}
                {activeTab === "history" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <PostList />
                    </div>
                )}
                {activeTab === "ads" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <AdManager />
                    </div>
                )}
            </div>
        </div>
    );
}
