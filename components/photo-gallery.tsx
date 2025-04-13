"use client"

import { useState } from "react"
import Image from "next/image"

import { Dialog, DialogContent } from "@/components/ui/dialog"

type Photo = {
  id: string
  path: string
  filename: string
  createdAt: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <p className="text-gray-500 mb-2">
          Der er ikke uploadet nogen billeder endnu.
        </p>
        <p className="text-sm text-gray-400">
          Vær den første til at dele et minde!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square relative rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.path || "/placeholder.svg"}
              alt="Bryllupsbillede"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-3xl w-[90vw] p-1 bg-transparent border-none">
          {selectedPhoto && (
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9]">
              <Image
                src={selectedPhoto.path || "/placeholder.svg"}
                alt="Bryllupsbillede"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
