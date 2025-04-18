"use server"

import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

import { sendMultiplePhotosNotification, sendPhotoNotification } from "./email"
import { prisma } from "./prisma"
import { compressImageBuffer } from "./server-utils"
import { supabase } from "./supabase"

// Type definition baseret på Prisma Photo model
type Photo = {
  id: string
  filename: string
  path: string
  createdAt: Date
  uploadedBy: string | null
  bucketPath: string
}

export async function uploadPhoto(file: File, name?: string) {
  try {
    const id = nanoid()
    const filename = `${id}-${file.name.replace(/\s+/g, "-").toLowerCase()}`
    const bucketName = "wedding-photos"

    // Konverter File til ArrayBuffer og derefter til Buffer
    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)

    // Komprimér billedet på serversiden med sharp
    const fileType = file.type.split("/")[1] as "jpeg" | "png" | "webp" | string
    const format = ["jpeg", "png", "webp"].includes(fileType)
      ? (fileType as "jpeg" | "png" | "webp")
      : "jpeg"

    buffer = await compressImageBuffer(buffer, {
      quality: 80,
      width: 1920,
      height: 1080,
      format,
    })

    // Upload filen til Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: `image/${format}`,
        cacheControl: "3600",
      })

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`)
    }

    // Få offentlig URL til filen
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename)

    const publicPath = urlData.publicUrl

    // Gem i Prisma databasen
    const photo = await prisma.photo.create({
      data: {
        filename,
        path: publicPath,
        uploadedBy: name || "Anonym",
        bucketPath: `${bucketName}/${filename}`,
      },
    })

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

// Denne form funktion tager FormData i stedet for File[] for at undgå serialiseringsproblemer
export async function uploadPhotoForm(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[]
    const name = formData.get("name") as string

    if (!files.length) {
      throw new Error("Ingen filer at uploade")
    }

    const uploadedPaths: string[] = []

    // Upload hvert billede enkeltvis
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
    }

    return { success: true, paths: uploadedPaths }
  } catch (error) {
    console.error("Fejl ved upload af billeder:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    } else {
      return {
        success: false,
        error: "Kunne ikke uploade billeder: Ukendt fejl",
      }
    }
  }
}

// Behold for bagudkompatibilitet, men brug uploadPhotoForm i stedet
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

export async function getPhotos() {
  try {
    // Hent alle billeder fra databasen
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    // Konverter Date objekter til strenge for at matche forventet type i UI
    return photos.map((photo: Photo) => ({
      ...photo,
      createdAt: photo.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Fejl ved hentning af billeder:", error)
    return []
  }
}

export async function clearAllPhotos() {
  try {
    // Hent alle billeder fra databasen
    const photos = await prisma.photo.findMany()

    // Slet filer i Supabase storage
    for (const photo of photos as Photo[]) {
      const bucketPath = photo.bucketPath
      const pathParts = bucketPath.split("/")
      if (pathParts.length >= 2) {
        const bucket = pathParts[0]
        const filename = pathParts[1]

        // Slet fra Supabase storage
        const { error } = await supabase.storage.from(bucket).remove([filename])

        if (error) {
          console.error(`Kunne ikke slette ${filename} fra Supabase:`, error)
        }
      }
    }

    // Slet alle billeder fra databasen
    await prisma.photo.deleteMany({})

    // Invalider cache for at opdatere UI
    revalidatePath("/gallery")

    return { success: true, message: `${photos.length} billeder blev slettet` }
  } catch (error) {
    console.error("Fejl ved sletning af alle billeder:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Ukendt fejl under sletning af billeder" }
  }
}
