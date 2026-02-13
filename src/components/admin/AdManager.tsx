"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Globe, Clock, Image as ImageIcon, Link as LinkIcon, Type } from "lucide-react";

export function AdManager() {
    const { t } = useLanguage();
    const [enabled, setEnabled] = useState(false);
    const [adData, setAdData] = useState({
        imageUrl: "",
        text: "",
        link: "",
        expiryDays: 5
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "ads", "config"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setEnabled(data.enabled ?? false);
                if (data.activeAd) {
                    setAdData({
                        imageUrl: data.activeAd.imageUrl || "",
                        text: data.activeAd.text || "",
                        link: data.activeAd.link || "",
                        expiryDays: data.activeAd.expiryDays || 5
                    });
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        try {
            await setDoc(doc(db, "ads", "config"), {
                enabled,
                activeAd: adData,
                updatedAt: new Date()
            });
            toast.success(t("common.success"));
        } catch (e) {
            console.error(e);
            toast.error(t("common.error"));
        }
    };

    if (loading) return <div>Loading ad settings...</div>;

    return (
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-border/50">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Globe className="h-6 w-6 text-blue-600" />
                        {t("ads.management")}
                    </h2>
                    <p className="text-muted-foreground mt-1">Manage global advertisement settings and banner.</p>
                </div>

                <Button
                    variant={enabled ? "primary" : "secondary"}
                    onClick={() => setEnabled(!enabled)}
                    className={enabled ? "bg-green-600 hover:bg-green-700" : ""}
                >
                    {enabled ? t("ads.active") : t("ads.disable")}
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> {t("ads.image_url")}
                        </label>
                        <input
                            type="url"
                            value={adData.imageUrl}
                            onChange={(e) => setAdData({ ...adData, imageUrl: e.target.value })}
                            className="w-full p-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="https://example.com/banner.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Type className="h-4 w-4" /> {t("ads.text")}
                        </label>
                        <input
                            type="text"
                            value={adData.text}
                            onChange={(e) => setAdData({ ...adData, text: e.target.value })}
                            className="w-full p-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Special Offer! Click here."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" /> {t("ads.link")}
                            </label>
                            <input
                                type="url"
                                value={adData.link}
                                onChange={(e) => setAdData({ ...adData, link: e.target.value })}
                                className="w-full p-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="https://mysite.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {t("ads.expiry")}
                            </label>
                            <input
                                type="number"
                                value={adData.expiryDays}
                                onChange={(e) => setAdData({ ...adData, expiryDays: parseInt(e.target.value) || 0 })}
                                className="w-full p-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 transition-all"
                                min="1"
                            />
                        </div>
                    </div>

                    <Button onClick={handleSave} className="w-full py-6 font-bold shadow-md hover:shadow-lg transition-all">
                        {t("ads.save")}
                    </Button>
                </div>

                <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-center min-h-[300px]">
                    {adData.imageUrl ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg group">
                            {/* Ad Preview */}
                            <img src={adData.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white font-bold text-center px-4">{adData.text}</p>
                            </div>
                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                                Ad
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg w-full">
                            <p>Ad Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
