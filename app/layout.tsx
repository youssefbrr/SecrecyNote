import "@/app/globals.css";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "@/components/mode-toggle";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NoteRefreshProvider } from "@/components/providers/note-refresh-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import type React from "react";

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
        className={cn(
          "min-h-screen bg-background antialiased selection:bg-primary/10 selection:text-primary",
          inter.className
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NoteRefreshProvider>
              <div className='relative flex min-h-screen flex-col'>
                <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                  <div className='container flex h-14 items-center'>
                    <div className='mr-4 flex'>
                      <Link
                        href='/'
                        className='mr-2 flex items-center space-x-2'
                      >
                        <span className='font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                          Secure Notes
                        </span>
                      </Link>
                    </div>
                    <div className='flex-1'></div>
                    <div className='flex items-center space-x-2'>
                      <UserProfile />
                      <ModeToggle />
                    </div>
                  </div>
                </header>
                <main className='flex-1'>{children}</main>
                <footer className='border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                  <div className='container flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground md:flex-row'>
                    <p>
                      © {new Date().getFullYear()} Secure Notes. All rights
                      reserved.
                    </p>
                    <div className='flex items-center gap-4'>
                      <Link
                        href='/privacy'
                        className='hover:text-primary transition-colors'
                      >
                        Privacy
                      </Link>
                      <Link
                        href='/terms'
                        className='hover:text-primary transition-colors'
                      >
                        Terms
                      </Link>
                    </div>
                  </div>
                </footer>
              </div>
            </NoteRefreshProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
