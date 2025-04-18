import { NextRequest, NextResponse } from "next/server"

import { uploadPhotoForm } from "../../../lib/actions"

// Konfigurationer for App Router API-ruter
export const dynamic = "force-dynamic"

// Denne konfiguration angiver at route ikke bør parsere kroppen automatisk
// Så vi kan acceptere store filer
export async function POST(request: NextRequest) {
  try {
    // Vent på at formData er klar, selv for store requests
    const formData = await request.formData()
    const result = await uploadPhotoForm(formData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json(
      { success: false, error: "Kunne ikke uploade billeder: Server fejl" },
      { status: 500 }
    )
  }
}
