import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { NewsFeed } from "@/components/news/NewsFeed";
import { NewsItem } from "@/lib/types";

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
    return [
        { slug: 'sport' },
        { slug: 'technology' },
        { slug: 'political' },
        { slug: 'cinema' },
    ];
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let news: NewsItem[] = [];
    let error = null;

    try {
        // Try complex query first (requires index)
        const q = query(
            collection(db, "posts"),
            where("category", "==", slug),
            orderBy("createdAt", "desc"),
            limit(20)
        );
        const querySnapshot = await getDocs(q);
        news = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
            } as NewsItem;
        });
    } catch (err: any) {
        // Fallback for missing index: query strictly by category
        if (err.code === 'failed-precondition' || err.toString().includes('index')) {
            console.warn("Index missing for complex query. Falling back to simple query.");
            const qSimple = query(
                collection(db, "posts"),
                where("category", "==", slug),
                limit(20)
            );
            const querySnapshot = await getDocs(qSimple);
            const rawNews = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
                } as NewsItem;
            });
            // Sort in memory
            news = rawNews.sort((a, b) => {
                const tA = a.createdAt?.seconds || 0;
                const tB = b.createdAt?.seconds || 0;
                return tB - tA;
            });
        } else {
            console.error(`Error fetching category ${slug}:`, err);
            error = "Failed to load news for this category.";
        }
    }

    // Capitalize slug for title
    const title = slug.charAt(0).toUpperCase() + slug.slice(1);

    return (
        <div className="space-y-8">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl capitalize">
                    {title} News
                </h1>
                <p className="text-muted-foreground mt-2">Latest updates from the {title} world.</p>
            </div>

            {error ? (
                <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>
            ) : news.length > 0 ? (
                <NewsFeed initialNews={news} />
            ) : (
                <div className="py-20 text-center text-muted-foreground bg-muted/30 rounded-xl">
                    <h3 className="text-xl font-semibold mb-2">No news found</h3>
                    <p>We haven't posted any {slug} news yet. Check back later!</p>
                </div>
            )}
        </div>
    );
}
