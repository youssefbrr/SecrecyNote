import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "white" }, { media: "(prefers-color-scheme: dark)", color: "black" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: "SecureNote - Private & Encrypted Notes",
  description: "Create, view, and manage private, encrypted notes that self-destruct",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/icons/icon-192x192.png" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SecureNote",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "SecureNote",
    title: "SecureNote - Private & Encrypted Notes",
    description: "Create, view, and manage private, encrypted notes that self-destruct",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureNote",
    description: "Create, view, and manage private, encrypted notes that self-destruct",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          storageKey="secure-note-theme"
        >
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'