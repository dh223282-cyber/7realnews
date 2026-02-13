import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "7RealNews - Latest News in Tamil & English",
  description: "Stay updated with the latest news in Sport, Technology, Politics, and Cinema.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
              <Navbar />
              <main className="flex-1 container py-6 md:py-10 max-w-screen-2xl px-4 md:px-8">
                {children}
              </main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-2xl px-4 md:px-8">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2024 7RealNews. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster position="bottom-right" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
