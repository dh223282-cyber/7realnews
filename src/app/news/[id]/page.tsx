import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { NewsDetailClient } from "@/components/news/NewsDetailClient";
import { Metadata } from "next";
import { NewsItem } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const news = await getNews(id);
    if (!news) return { title: 'News Not Found' };

    const title = news.englishTitle || news.title;

    return {
        title: `${title} | 7RealNews`,
        description: news.content ? news.content.substring(0, 160) : "",
        openGraph: {
            title: title,
            description: news.content ? news.content.substring(0, 160) : "",
            images: [news.imageUrl || "/default-og.png"],
        },
    };
}

async function getNews(id: string): Promise<NewsItem | null> {
    try {
        const docRef = doc(db, "posts", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return null;
        const data = snap.data();
        return {
            id: snap.id,
            ...data,
            createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
        } as NewsItem;
    } catch (error) {
        console.error("Error fetching news detail:", error);
        return null;
    }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const news = await getNews(id);

    if (!news) {
        notFound();
    }

    return <NewsDetailClient news={news} />;
}
