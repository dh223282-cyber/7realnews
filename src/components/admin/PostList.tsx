"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";
import { enUS, ta } from "date-fns/locale";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import Image from "next/image";

interface NewsItem {
    id: string;
    title: string;
    category: string;
    createdAt: any;
    imageUrl?: string;
}

export function PostList() {
    const { language, t } = useLanguage();
    const [posts, setPosts] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Basic query, in real app usage pagination is key
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as NewsItem[];
            setPosts(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm(t("admin.confirm_delete"))) {
            try {
                await deleteDoc(doc(db, "posts", id));
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-muted-foreground">Loading posts...</div>;
    }

    if (posts.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No posts found. Upload your first news!</div>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
                <div key={post.id} className="group border border-border/50 rounded-xl p-4 bg-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-muted">
                            {post.imageUrl ? (
                                <Image
                                    src={post.imageUrl}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    alt={post.title}
                                    unoptimized // Avoid optimization errors with external images if domain not configured
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                                {t(`nav.${post.category}`) || post.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {post.createdAt?.seconds ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true, locale: language === "ta" ? ta : enUS }) : "Just now"}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                        </h3>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border/50">
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                            <Edit className="h-3.5 w-3.5 mr-1.5" /> {t("admin.edit")}
                        </Button>
                        <Button size="sm" variant="danger" className="h-8 px-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> {t("admin.delete")}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
