"use server"

import { existsSync } from "fs"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

import { sendMultiplePhotosNotification, sendPhotoNotification } from "./email"

type Photo = {
  id: string
  filename: string
  path: string
  createdAt: string
  uploadedBy?: string
}

// Simpel lokal in-memory database til at gemme billeder
let photos: Photo[] = []

export async function uploadPhoto(file: File, name?: string) {
  try {
    const id = nanoid()
    const filename = `${id}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    // Opret uploads mappen hvis den ikke findes
    const uploadsDir = path.join(process.cwd(), "public/uploads")

    // Tjek om mappen eksisterer, hvis ikke, opret den
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
      console.log("Oprettede uploads mappe:", uploadsDir)
    }

    // Konverter File til ArrayBuffer og derefter til Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Gem filen lokalt i public/uploads mappen
    const filePath = path.join(uploadsDir, filename)
    await writeFile(filePath, buffer as unknown as Uint8Array)

    console.log("Billede gemt lokalt:", filePath)

    // Stien til billedet som kan tilgås fra browseren
    const publicPath = `/uploads/${filename}`

    // Gem billedets metadata
    const photo: Photo = {
      id,
      filename,
      path: publicPath,
      createdAt: new Date().toISOString(),
      uploadedBy: name,
    }

    // Gem i vores simple in-memory database
    photos.unshift(photo)

    // Send email notification (kun for enkelt billede upload)
    if (name === undefined) {
      console.log("Sender e-mail notifikation...")
      try {
        await sendPhotoNotification(publicPath, name)
        console.log("E-mail notifikation sendt")
      } catch (emailError) {
        console.error("Kunne ikke sende e-mail notifikation:", emailError)
        // Vi fortsætter selvom e-mail fejler - vi logger blot fejlen
      }
    }

    revalidatePath("/gallery")
    return publicPath
  } catch (error) {
    console.error("Fejl ved upload af billede:", error)
    if (error instanceof Error) {
      throw new Error(`Kunne ikke uploade billede: ${error.message}`)
    } else {
      throw new Error("Kunne ikke uploade billede: Ukendt fejl")
    }
  }
}

export async function uploadPhotos(files: File[], name: string) {
  try {
    if (!files.length) {
      throw new Error("Ingen filer at uploade")
    }

    const uploadedPaths: string[] = []

    // Upload hvert billede enkeltvis (uden at sende mails)
    for (const file of files) {
      const path = await uploadPhoto(file, name)
      uploadedPaths.push(path)
    }

    // Send én samlet e-mail med alle billeder
    console.log(
      `Sender e-mail notifikation med ${uploadedPaths.length} billeder...`
    )
    try {
      await sendMultiplePhotosNotification(uploadedPaths, name)
      console.log("E-mail notifikation med alle billeder sendt")
    } catch (emailError) {
      console.error("Kunne ikke sende e-mail notifikation:", emailError)
      // Vi fortsætter selvom e-mail fejler - vi logger blot fejlen
    }

    return uploadedPaths
  } catch (error) {
    console.error("Fejl ved upload af billeder:", error)
    if (error instanceof Error) {
      throw new Error(`Kunne ikke uploade billeder: ${error.message}`)
    } else {
      throw new Error("Kunne ikke uploade billeder: Ukendt fejl")
    }
  }
}

export async function getPhotos(): Promise<Photo[]> {
  // Returner alle billeder fra vores simple in-memory database
  return photos
}
