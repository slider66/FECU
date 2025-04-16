import { Metadata } from "next"
import Link from "next/link"
import { HeartIcon, Upload } from "lucide-react"

import { getPhotos } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { PhotoGallery } from "@/components/photo-gallery"

export const metadata: Metadata = {
  title: "Bryllupsgalleri | Renas & Ayse's Bryllup",
  description: "Se alle de dejlige billeder fra vores bryllup",
  openGraph: {
    title: "Bryllupsgalleri | Renas & Ayse's Bryllup",
    description: "Se alle de dejlige billeder fra vores bryllup",
    type: "website",
  },
}

export default async function GalleryPage() {
  const photos = await getPhotos()

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <header className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center">
              <HeartIcon className="h-5 w-5 text-rose-400 mr-2" />
              <h1 className="text-2xl font-serif font-medium text-gray-800">
                Renas & Ayse
              </h1>
              <HeartIcon className="h-5 w-5 text-rose-400 ml-2" />
            </div>
          </Link>
          <h2 className="text-xl font-serif mb-1 text-gray-800">
            Bryllupsgalleri
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Minder fra vores særlige dag
          </p>
        </header>

        {/* Gallery */}
        <div className="animate-fade-in">
          <PhotoGallery photos={photos} />
        </div>
      </div>
    </main>
  )
}
