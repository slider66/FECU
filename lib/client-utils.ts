"use client"

import imageCompression from "browser-image-compression"

export async function compressImageClient(file: File): Promise<File> {
  try {
    const options = {
      maxSizeMB: 1, // Komprimér til maks 1MB
      maxWidthOrHeight: 1200, // Skaler billeder ned til maks 1200px
      useWebWorker: true, // Brug web worker for bedre performance
      fileType: file.type, // Bevar original filtype
    }

    const compressedFile = await imageCompression(file, options)

    console.log("Original størrelse:", file.size / 1024 / 1024, "MB")
    console.log(
      "Komprimeret størrelse:",
      compressedFile.size / 1024 / 1024,
      "MB"
    )

    return compressedFile
  } catch (error) {
    console.error("Fejl under billedkompression:", error)
    // Returner det originale billede hvis kompression fejler
    return file
  }
}
