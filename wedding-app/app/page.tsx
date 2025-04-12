import Image from "next/image"
import Link from "next/link"
import { Camera, HeartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="container px-4 py-12 mx-auto max-w-md">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <HeartIcon className="h-6 w-6 text-rose-400 mr-2" />
            <h1 className="text-3xl font-serif font-medium text-gray-800">
              Renas & Ayse
            </h1>
            <HeartIcon className="h-6 w-6 text-rose-400 ml-2" />
          </div>
          <p className="text-lg text-gray-600 mb-2 font-serif">
            Our Wedding Celebration
          </p>
          <p className="text-sm text-gray-500">April 15, 2025</p>
        </header>

        {/* Hero Image */}
        <div className="relative w-full h-64 mb-8 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
          <Image
            src="/tender-embrace.png"
            alt="Renas and Ayse"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
            <div className="p-4 text-white">
              <p className="font-serif text-xl">
                Thank you for celebrating with us!
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 text-center animate-fade-in">
          <h2 className="text-xl font-serif mb-3 text-gray-800">
            Share Your Memories
          </h2>
          <p className="text-gray-600 mb-6">
            Help us capture all the special moments from our wedding day
          </p>

          <div className="flex flex-col gap-4">
            <Link href="/upload" className="w-full">
              <Button className="w-full bg-rose-500 hover:bg-rose-600 transition-all">
                <Camera className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
            </Link>

            <Link href="/gallery" className="w-full">
              <Button
                variant="outline"
                className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
              >
                View Gallery
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 animate-fade-in">
          <p>Made with love for our special day</p>
        </footer>
      </div>
    </main>
  )
}
