import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Camera, HeartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

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
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="container mx-auto max-w-md px-4 py-12">
        {/* Header */}
        <header className="animate-fade-in mb-6 text-center">
          <div className="mb-4 flex items-center justify-center">
            <HeartIcon className="mr-2 size-6 text-rose-400" />
            <h1 className="font-serif text-3xl font-medium text-gray-800">
              Renas & Ayse
            </h1>
            <HeartIcon className="ml-2 size-6 text-rose-400" />
          </div>
          <p className="mb-2 font-serif text-lg text-gray-600">
            Vores bryllupsfest
          </p>
          <p className="text-sm text-gray-500">07. juni 2025</p>
        </header>

        {/* Hero Image */}
        <div className="animate-fade-in relative mb-8 h-64 w-full overflow-hidden rounded-2xl shadow-lg ">
          <Image
            src="/Renas_Ayse2.jpeg"
            alt="Renas and Ayse"
            fill
            className="object-cover brightness-90"
            priority
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-rose-900/40 via-rose-800/20 to-rose-500/15">
            <div className="p-4 text-white">
              <p className="font-serif text-xl">
                Tak for at du deltager til vores bryllup!
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="animate-fade-in mb-8 rounded-2xl bg-white/80 p-6 text-center shadow-lg backdrop-blur-sm">
          <h2 className="mb-3 font-serif text-xl text-gray-800">
            Del dine minder
          </h2>
          <p className="mb-6 text-gray-600">
            Hjælp os med at fange alle de specielle øjeblikke fra vores bryllup
          </p>

          <div className="flex flex-col gap-4">
            <Link href="/upload" className="w-full">
              <Button className="w-full bg-rose-500 transition-all hover:bg-rose-600">
                <Camera className="mr-2 size-4" />
                Upload billeder
              </Button>
            </Link>

            <Link href="/gallery" className="w-full">
              <Button
                variant="outline"
                className="w-full border-rose-200 text-rose-600 transition-all hover:bg-rose-50 hidden"
              >
                Se galleri
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="animate-fade-in text-center text-sm text-gray-500">
          <p>Lavet med &#x2665;&#xfe0f; af Gøkmen Øzbayir</p>
        </footer>
      </div>
    </main>
  )
}
