import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
        } catch (error: any) {
            console.error(error);
            toast.error("Invalid credentials or error logging in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md p-8 bg-card text-card-foreground rounded-xl shadow-2xl border border-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Access
                    </h2>
                    <p className="text-muted-foreground mt-2">Enter credentials to manage news</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="admin@7realnews.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        {loading ? "Authenticating..." : "Secure Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
