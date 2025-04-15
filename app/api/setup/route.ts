import { NextResponse } from "next/server"

import { setupSupabaseStorage } from "@/lib/supabase-setup"

export async function GET() {
  try {
    const result = await setupSupabaseStorage()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Setup fejl:", error)
    return NextResponse.json(
      { success: false, error: "Intern server fejl" },
      { status: 500 }
    )
  }
}
