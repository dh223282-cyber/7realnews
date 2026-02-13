"use client";

import { NewsCard } from "./NewsCard";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function NewsFeed({ initialNews }: { initialNews: any[] }) {
    const [adConfig, setAdConfig] = useState<any>(null);
    const [loadingAd, setLoadingAd] = useState(true);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const snap = await getDoc(doc(db, "ads", "config"));
                if (snap.exists() && snap.data().enabled) {
                    setAdConfig(snap.data().activeAd);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingAd(false);
            }
        };
        fetchAd();
    }, []);

    // Insert ad after index 2 (3rd item) so it appears between 3rd and 4th
    const itemsWithAd = [...initialNews];

    // Only inject if we have ads and enough news
    if (adConfig && initialNews.length > 3) {
        // Inject at index 3
        itemsWithAd.splice(3, 0, { isAd: true, ...adConfig });
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 auto-rows-fr">
            {itemsWithAd.map((item, index) => {
                if (item.isAd) {
                    return (
                        <div
                            key="ad-banner"
                            className="col-span-full my-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center relative group min-h-[250px]"
                        >
                            <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                                {item.imageUrl && (
                                    <Image
                                        src={item.imageUrl}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                        alt="Advertisement"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent" />
                            </div>

                            <div className="relative z-10 p-8 md:w-1/2 flex flex-col justify-center items-start text-left space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-yellow-400 text-black text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded">Sponsored</span>
                                    <span className="text-gray-400 text-xs">Ad</span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    {item.text}
                                </h3>

                                {item.link && (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-full bg-white text-black font-bold py-3 px-8 text-sm hover:scale-105 transition-transform shadow-lg hover:shadow-white/20 mt-4"
                                    >
                                        Learn More
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                }

                return <NewsCard key={item.id} news={item} />;
            })}
        </div>
    );
}
