import { AuthProvider } from "@/components/providers/auth-provider";
import { NoteRefreshProvider } from "@/components/providers/note-refresh-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
          <AuthProvider>
            <NoteRefreshProvider>
              <div className='relative flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95'>
                <SiteHeader />
                <main className='flex-1 w-full'>{children}</main>
                <SiteFooter />
              </div>
            </NoteRefreshProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
