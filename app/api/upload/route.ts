import { NextRequest, NextResponse } from "next/server"

import { uploadPhotoForm } from "../../../lib/actions"

// Konfigurationer for App Router API-ruter
export const dynamic = "force-dynamic"

// Tillad større uploads (50MB)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "50mb",
  },
}

// Denne konfiguration angiver at route ikke bør parsere kroppen automatisk
// Så vi kan acceptere store filer
export async function POST(request: NextRequest) {
  try {
    // Implementer timeout-håndtering
    const timeout = setTimeout(() => {
      console.error("Upload request timeout efter 60 sekunder")
    }, 60000)

    // Vent på at formData er klar, selv for store requests
    const formData = await request.formData()
    const result = await uploadPhotoForm(formData)

    clearTimeout(timeout)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload API error:", error)
    let errorMessage = "Kunne ikke uploade billeder: Server fejl"

    if (error instanceof Error) {
      // Log den specifikke fejl for debugging
      console.error("Specifik fejl:", error.message)

      // Check om fejlen er relateret til filstørrelse
      if (
        error.message.includes("size") ||
        error.message.includes("størrelse")
      ) {
        errorMessage =
          "Filerne er for store til at uploade. Prøv med mindre filer eller færre billeder."
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
