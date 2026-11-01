import type { Metadata } from "next";
import { Geist, Geist_Mono, Gloock } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gloock = Gloock({
  variable: "--font-gloock",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookNook | A Small Online Library",
  description:
    "Add a book, borrow a book, return a book. A shared shelf for readers, with live copy counts and fourteen-day loans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${gloock.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-[60] px-4 py-2 border border-foreground bg-background text-foreground label-mono"
          >
            Skip to content
          </a>
          <Suspense fallback={<div className="h-[60px]" />}>
            <Navbar />
          </Suspense>
          <main id="main-content" className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "rounded-none border border-border bg-card text-card-foreground shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)] font-sans text-sm",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
