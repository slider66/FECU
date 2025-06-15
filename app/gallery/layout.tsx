import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bryllupsgalleri | Renas & Ayse's Bryllup",
  description: "Se alle de dejlige billeder fra vores bryllup",
  openGraph: {
    title: "Bryllupsgalleri | Renas & Ayse's Bryllup",
    description: "Se alle de dejlige billeder fra vores bryllup",
    type: "website",
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
