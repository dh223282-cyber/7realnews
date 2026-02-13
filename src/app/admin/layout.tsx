"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <LoginForm />;
    }

    // Could add sidebar here if needed
    return (
        <div className="admin-container">
            {children}
        </div>
    );
}
