import { NextResponse, type NextRequest } from "next/server"

// Dette sikrer at vores middleware kun kører på serveren
export const config = {
  matcher: [
    /*
     * Match alle forespørgsler til ruter undtagen:
     * - API routes
     * - _next/static (statiske filer)
     * - _next/image (billedoptimering)
     * - favicon.ico (favicon filen)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

// Variabel til at spore, om opsætningen er udført
let isSetupDone = false

export async function middleware(request: NextRequest) {
  // Kør kun opsætningen én gang per server-start
  if (!isSetupDone) {
    try {
      // Dynamisk import for at undgå problemer ved buildtime
      const { setupSupabaseStorage } = await import("./lib/supabase-setup")

      // Kald opsætningsfunktionen
      const result = await setupSupabaseStorage()
      if (result.success) {
        console.log("Supabase storage bucket opsat korrekt via middleware")
      } else {
        console.error(
          "Fejl ved opsætning af Supabase storage bucket:",
          result.error
        )
      }
    } catch (error) {
      console.error("Middleware fejl ved opsætning af Supabase storage:", error)
      // Vi fortsætter selvom der er en fejl
    } finally {
      // Marker opsætningen som fuldført
      isSetupDone = true
    }
  }

  // Returner NextResponse.next() for at fortsætte med den normale request
  return NextResponse.next()
}
