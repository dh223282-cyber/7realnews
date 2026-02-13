"use client";

import { useState } from "react";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { db, storage, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

export function NewsForm({ onSuccess }: { onSuccess?: () => void }) {
    const { t } = useLanguage();
    const [title, setTitle] = useState("");
    const [englishTitle, setEnglishTitle] = useState("");
    const [content, setContent] = useState("");
    const [englishContent, setEnglishContent] = useState("");
    const [category, setCategory] = useState("sport");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoLink, setVideoLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const categories = ["sport", "technology", "political", "cinema"];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Admin Auth Check
        if (!auth.currentUser) {
            toast.error("You must be logged in as an admin to post news.");
            console.error("Auth check failed: No current user");
            return;
        }

        if (!title || !englishTitle || !content || !englishContent || !category) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            let imageUrl = "";
            if (imageFile) {
                console.log("Starting image upload...");
                const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                imageUrl = await new Promise<string>((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        uploadTask.cancel();
                        reject(new Error("Upload timed out after 30 seconds. Check your connection or Storage Rules."));
                    }, 30000);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                            console.log("Upload is " + progress + "% done");
                        },
                        (error) => {
                            clearTimeout(timeoutId);
                            console.error("Upload error:", error);
                            reject(error);
                        },
                        async () => {
                            clearTimeout(timeoutId);
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("File available at", downloadURL);
                            resolve(downloadURL);
                        }
                    );
                });
            }

            console.log("Adding document to Firestore...");
            await addDoc(collection(db, "posts"), {
                title,
                englishTitle,
                content,
                englishContent,
                category,
                imageUrl,
                videoLink,
                createdAt: serverTimestamp(),
                views: 0,
            });

            toast.success(t("common.success"));
            setTitle("");
            setEnglishTitle("");
            setContent("");
            setEnglishContent("");
            setImageFile(null);
            setImagePreview(null);
            setVideoLink("");
            setUploadProgress(0);
            if (onSuccess) onSuccess();

        } catch (error: any) {
            console.error("Submission error:", error);
            if (error.code === 'storage/unauthorized') {
                toast.error("Permission denied: You cannot upload images to Storage.");
            } else if (error.code === 'permission-denied') {
                toast.error("Permission denied: You cannot upload news to Firestore.");
            } else {
                toast.error("Error: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
            {/* Progress Bar Overlay/Indicator */}
            {loading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background p-6 rounded-xl shadow-2xl w-full max-w-sm text-center space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
                        <h3 className="text-xl font-bold">Uploading Image...</h3>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</p>
                    </div>
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("admin.category")}</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 rounded border bg-background capitalize"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {t(`nav.${c}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tamil Title (Transliterate)</label>
                        <ReactTransliterate
                            renderComponent={(props) => (
                                <textarea
                                    {...props}
                                    className="w-full p-2 rounded border bg-background min-h-[80px]"
                                    placeholder={t("admin.title_placeholder")}
                                />
                            )}
                            value={title}
                            onChangeText={setTitle}
                            lang="ta"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t("admin.english_title_placeholder")}</label>
                        <input
                            type="text"
                            value={englishTitle}
                            onChange={(e) => setEnglishTitle(e.target.value)}
                            className="w-full p-2 rounded border bg-background"
                            placeholder="e.g. New Policy Announced"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("admin.image")}</label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition cursor-pointer relative min-h-[150px] flex items-center justify-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {imagePreview ? (
                                <div className="relative w-full h-full min-h-[150px]">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-contain rounded"
                                    />
                                </div>
                            ) : (
                                <div className="text-muted-foreground">
                                    <Upload className="mx-auto h-8 w-8 mb-2" />
                                    <span>Click to upload thumbnail</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t("admin.video")}</label>
                        <input
                            type="url"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            className="w-full p-2 rounded border bg-background"
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tamil Content (Transliterate)</label>
                    <ReactTransliterate
                        renderComponent={(props) => (
                            <textarea
                                {...props}
                                className="w-full p-2 rounded border bg-background min-h-[150px]"
                                placeholder={t("admin.content_placeholder")}
                            />
                        )}
                        value={content}
                        onChangeText={setContent}
                        lang="ta"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">English Content (Standard Input)</label>
                    <textarea
                        value={englishContent}
                        onChange={(e) => setEnglishContent(e.target.value)}
                        className="w-full p-2 rounded border bg-background min-h-[150px]"
                        placeholder={t("admin.content_english_placeholder") || "Enter English Content"}
                    />
                </div>
            </div>

            <div className="flex gap-4 justify-end">
                <Button type="button" variant="ghost" onClick={() => window.location.reload()}>
                    {t("admin.cancel")}
                </Button>
                <Button type="submit" disabled={loading} className="px-8">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("admin.submitting")}
                        </>
                    ) : (
                        t("admin.submit")
                    )}
                </Button>
            </div>
        </form>
    );
}
