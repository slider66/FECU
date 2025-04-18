"use server"

// Fjernet sharp import da det forårsager problemer ved deploy

export async function compressImageBuffer(
  buffer: Buffer,
  options: {
    quality?: number
    width?: number
    height?: number
    format?: "jpeg" | "png" | "webp"
  } = {}
): Promise<Buffer> {
  // Returnerer simpelthen den oprindelige buffer da server-side kompression med Sharp
  // forårsager problemer under deployment i Vercel's serverless miljø

  // Note: Server-side billedkompression er deaktiveret og sker nu kun på klienten
  return buffer
}
