import type React from "react"

import "@/styles/globals.css"
import { fontSans, fontSerif } from "@/lib/fonts"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Renas & Ayse's Bryllup",
  description: "Del dine billeder fra vores specielle dag",
  icons: {
    icon: [{ url: "/love_heart.ico" }],
    shortcut: ["/love_heart.ico"],
    apple: [{ url: "/love_heart.ico" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
