import { NoteRefreshProvider } from "@/components/providers/note-refresh-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/ui/header";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SecrecyNote - Private & Encrypted Notes",
  description:
    "Create, view, and manage private, encrypted notes that self-destruct",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/icons/icon-192x192.png" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SecrecyNote",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "SecrecyNote",
    title: "SecrecyNote - Private & Encrypted Notes",
    description:
      "Create, view, and manage private, encrypted notes that self-destruct",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecrecyNote",
    description:
      "Create, view, and manage private, encrypted notes that self-destruct",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          storageKey='secure-note-theme'
        >
          <NoteRefreshProvider>
            <div className='relative flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95'>
              <Header />
              <main className='flex-1 w-full'>{children}</main>
              <footer className='py-6 md:py-0 md:h-16 border-t bg-background/50 backdrop-blur-sm'>
                <div className='container h-full flex flex-col md:flex-row items-center justify-center md:justify-between text-sm'>
                  <p className='text-muted-foreground'>
                    &copy; {new Date().getFullYear()} SecrecyNote. All rights
                    reserved.
                  </p>
                  <div className='flex items-center space-x-4 mt-2 md:mt-0'>
                    <Link
                      href='/privacy'
                      className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                      Privacy
                    </Link>
                    <Link
                      href='/terms'
                      className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                      Terms
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </NoteRefreshProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
