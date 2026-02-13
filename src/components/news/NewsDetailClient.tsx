"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { enUS, ta } from "date-fns/locale";
import { Share2, Clock, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NewsDetailClient({ news }: { news: any }) {
    const { language, t } = useLanguage();
    const displayTitle = (language === 'en' && news.englishTitle) ? news.englishTitle : news.title;
    const displayContent = (language === 'en' && news.englishContent) ? news.englishContent : news.content;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: displayTitle,
                    text: news.content.substring(0, 100) + "...",
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert("Sharing not supported");
        }
    };

    return (
        <article className="max-w-4xl mx-auto py-8 px-4">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-blue-600 mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
            </Link>

            <header className="mb-8 space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {t(`nav.${news.category}`) || news.category}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {news.createdAt?.seconds ? formatDistanceToNow(new Date(news.createdAt.seconds * 1000), { addSuffix: true, locale: language === 'ta' ? ta : enUS }) : 'Unknown date'}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
                    {displayTitle}
                </h1>
            </header>

            {news.imageUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-10 border border-border/50">
                    <Image
                        src={news.imageUrl}
                        fill
                        className="object-cover"
                        alt={displayTitle}
                        priority
                    />
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-6 text-lg">
                {/* Since content is plain text usually, we preserve whitespace or use markdown if needed. 
             If plain text: whitespace-pre-wrap
         */}
                <div className="whitespace-pre-wrap font-serif">
                    {displayContent}
                </div>
            </div>

            {news.videoLink && (
                <div className="mt-10 aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                    {/* Smart Video Embed */}
                    {(() => {
                        let embedUrl = news.videoLink;
                        if (news.videoLink.includes("youtube.com/watch")) {
                            const urlParams = new URLSearchParams(new URL(news.videoLink).search);
                            const videoId = urlParams.get("v");
                            if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        } else if (news.videoLink.includes("youtu.be/")) {
                            const videoId = news.videoLink.split("youtu.be/")[1]?.split("?")[0];
                            if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        } else if (news.videoLink.includes("vimeo.com")) {
                            const videoId = news.videoLink.split("vimeo.com/")[1];
                            if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
                        }

                        return (
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allowFullScreen
                                title="Video Player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        );
                    })()}
                </div>
            )}

            <div className="mt-12 py-8 border-t border-border flex items-center justify-between">
                <div className="text-muted-foreground">
                    {t('news.posted')} by Admin
                </div>
                <Button onClick={handleShare} className="gap-2 shadow-lg hover:shadow-xl transition-all">
                    <Share2 className="h-4 w-4" />
                    {t('news.share')} Article
                </Button>
            </div>
        </article>
    );
}
