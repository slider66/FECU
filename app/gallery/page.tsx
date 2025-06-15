"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HeartIcon } from "lucide-react"

import { getPhotos } from "@/lib/actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PhotoGallery } from "@/components/photo-gallery"
import { SimpleLogin } from "@/components/simple-login"

export default function GalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [photosLoading, setPhotosLoading] = useState(false)

  useEffect(() => {
    // Tjek om brugeren allerede er logget ind (localStorage)
    const authStatus = localStorage.getItem("gallery-auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Hent billeder når brugeren er authenticated
    if (isAuthenticated) {
      const fetchPhotos = async () => {
        setPhotosLoading(true)
        try {
          const fetchedPhotos = await getPhotos()
          setPhotos(fetchedPhotos)
        } catch (error) {
          console.error("Fejl ved hentning af billeder:", error)
        } finally {
          setPhotosLoading(false)
        }
      }
      fetchPhotos()
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem("gallery-auth", "true")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 flex items-center justify-center">
        <LoadingSpinner text="Indlæser galleri..." size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <SimpleLogin onLogin={handleLogin} />
  }

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
          <button
            onClick={() => {
              setIsAuthenticated(false)
              localStorage.removeItem("gallery-auth")
            }}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Log ud
          </button>
        </header>

        {/* Gallery */}
        <div className="animate-fade-in">
          {photosLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Henter billeder..." size="md" />
            </div>
          ) : (
            <PhotoGallery photos={photos} />
          )}
        </div>
      </div>
    </main>
  )
}
