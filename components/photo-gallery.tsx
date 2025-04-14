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
      <div className="rounded-2xl bg-white/80 py-12 text-center shadow-lg backdrop-blur-sm">
        <p className="mb-2 text-gray-500">
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
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform hover:scale-[1.02]"
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
        <DialogContent className="w-[90vw] max-w-3xl border-none bg-transparent p-1">
          {selectedPhoto && (
            <div className="relative aspect-[4/3] w-full md:aspect-[16/9]">
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
