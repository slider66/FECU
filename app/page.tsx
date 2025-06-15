import { Metadata } from "next"

import { FloatingHearts } from "@/components/floating-hearts"
import { HomeContent } from "@/components/home-content"

export const metadata: Metadata = {
  title: "Renas & Ayse's Bryllup",
  description: "Del dine billeder fra vores specielle dag",
  openGraph: {
    title: "Renas & Ayse's Bryllup",
    description: "Del dine billeder fra vores specielle dag",
    type: "website",
  },
}

export default function Home() {
  return (
    <>
      <FloatingHearts />
      <HomeContent />
    </>
  )
}
