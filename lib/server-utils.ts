"use server"

import sharp from "sharp"

export async function compressImageBuffer(
  buffer: Buffer,
  options: {
    quality?: number
    width?: number
    height?: number
    format?: "jpeg" | "png" | "webp"
  } = {}
): Promise<Buffer> {
  try {
    const {
      quality = 80,
      width = 1200,
      height = 800,
      format = "jpeg",
    } = options

    // Reducer indbygget caching for at mindske hukommelsesforbrug
    sharp.cache(false)
    sharp.concurrency(1)

    let sharpInstance = sharp(buffer, { limitInputPixels: 30000000 }).resize({
      width,
      height,
      fit: "inside",
      withoutEnlargement: true,
    })

    if (format === "jpeg") {
      sharpInstance = sharpInstance.jpeg({ quality, progressive: true })
    } else if (format === "png") {
      sharpInstance = sharpInstance.png({ quality, progressive: false })
    } else if (format === "webp") {
      sharpInstance = sharpInstance.webp({ quality })
    }

    return await sharpInstance.toBuffer()
  } catch (error) {
    console.error("Error i sharp billedkompression:", error)
    // Returner den originale buffer som fallback
    return buffer
  }
}
