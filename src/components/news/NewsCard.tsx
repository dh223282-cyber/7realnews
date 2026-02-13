"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ta } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageContext';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsCardProps {
    news: {
        id: string;
        title: string;
        englishTitle?: string;
        content: string;
        imageUrl?: string;
        category: string;
        createdAt: any;
    };
}

export function NewsCard({ news }: NewsCardProps) {
    const { language, t } = useLanguage();

    // Logic: If language is 'en' and englishTitle exists, use it. Otherwise use title (Tamil).
    const displayTitle = (language === 'en' && news.englishTitle) ? news.englishTitle : news.title;

    // Content is currently single field (Tamil). In real app might want englishContent too.
    // We'll show it as is.

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: displayTitle,
                    text: news.content.substring(0, 100) + "...",
                    url: `${window.location.origin}/news/${news.id}`,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback or copy to clipboard
            alert("Sharing not supported on this browser");
        }
    };

    return (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
            <Link href={`/news/${news.id}`} className="block relative w-full h-56 overflow-hidden">
                {news.imageUrl ? (
                    <Image
                        src={news.imageUrl}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={displayTitle}
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm shadow-sm">
                        {t(`nav.${news.category}`) || news.category}
                    </span>
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    {news.createdAt?.seconds ? formatDistanceToNow(new Date(news.createdAt.seconds * 1000), { addSuffix: true, locale: language === 'ta' ? ta : enUS }) : 'Recently'}
                </div>

                <Link href={`/news/${news.id}`} className="block mb-3">
                    <h2 className="text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {displayTitle}
                    </h2>
                </Link>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {news.content}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-border/50 mt-auto">
                    <Link href={`/news/${news.id}`}>
                        <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            {t('news.read_more')} &rarr;
                        </span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-foreground">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
