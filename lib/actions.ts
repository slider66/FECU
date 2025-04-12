"use server"

import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"
import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"

type Photo = {
  id: string
  url: string
  createdAt: string
}

export async function uploadPhoto(file: File) {
  try {
    const id = nanoid()
    const filename = `${id}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Store metadata in Vercel KV
    const photo: Photo = {
      id,
      url: blob.url,
      createdAt: new Date().toISOString(),
    }

    // Add to the photos list
    await kv.lpush("wedding:photos", photo)

    revalidatePath("/gallery")
    return blob.url
  } catch (error) {
    console.error("Error uploading photo:", error)
    throw new Error("Failed to upload photo")
  }
}

export async function getPhotos(): Promise<Photo[]> {
  try {
    // Get photos from KV store
    const photos = await kv.lrange<Photo>("wedding:photos", 0, -1)
    return photos || []
  } catch (error) {
    console.error("Error fetching photos:", error)
    return []
  }
}
