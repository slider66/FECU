import type React from "react"

import "@/styles/globals.css"
import { fontSans, fontSerif } from "@/lib/fonts"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Renas & Ayse's Bryllup",
  description: "Del dine billeder fra vores specielle dag",
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
