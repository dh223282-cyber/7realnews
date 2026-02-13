import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { NewsFeed } from "@/components/news/NewsFeed";
import { AlertCircle } from "lucide-react";
import { NewsItem } from "@/lib/types";

// Revalidate content every 60 seconds for freshness
export const revalidate = 60;

export default async function Home() {
  let news: NewsItem[] = [];
  let error = null;

  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    news = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure serialization of timestamps for Client Components
        createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
      } as NewsItem;
    });
  } catch (err) {
    console.error("Error fetching news:", err);
    error = "Failed to load latest news. Please try again later.";
  }

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12 bg-muted/30 rounded-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x bg-300%">
          7RealNews
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your trusted source for breaking news in Sports, Technology, Politics, and Cinema.
          Reporting with integrity and speed.
        </p>
      </section>

      {error ? (
        <div className="flex items-center justify-center p-8 text-red-500 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>{error}</span>
        </div>
      ) : (
        <NewsFeed initialNews={news} />
      )}
    </div>
  );
}
