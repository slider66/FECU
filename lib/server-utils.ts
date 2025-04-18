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
  const { quality = 80, width = 1920, height = 1080, format = "jpeg" } = options

  let sharpInstance = sharp(buffer).resize({
    width,
    height,
    fit: "inside",
    withoutEnlargement: true,
  })

  if (format === "jpeg") {
    sharpInstance = sharpInstance.jpeg({ quality })
  } else if (format === "png") {
    sharpInstance = sharpInstance.png({ quality })
  } else if (format === "webp") {
    sharpInstance = sharpInstance.webp({ quality })
  }

  return await sharpInstance.toBuffer()
}
