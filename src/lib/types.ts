export interface NewsItem {
    id: string;
    title: string;
    englishTitle?: string;
    content: string;
    englishContent?: string;
    imageUrl?: string;
    videoLink?: string;
    category: string;
    createdAt: { seconds: number } | null;
    views?: number;
}

export interface AdConfig {
    imageUrl: string;
    text: string;
    link: string;
    expiryDays: number;
}
