import type React from "react"

import "@/styles/globals.css"
import { fontSans, fontSerif } from "@/lib/fonts"
import { InitSupabase } from "@/components/init-supabase"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Renas & Ayse's Bryllup",
  description: "Del dine billeder fra vores specielle dag",
  icons: {
    icon: [{ url: "/love_heart.ico" }],
    shortcut: ["/love_heart.ico"],
    apple: [{ url: "/love_heart.ico" }],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow, noimageindex" />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Supabase initialisering */}
          <InitSupabase />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
