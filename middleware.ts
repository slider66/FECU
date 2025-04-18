import { NextResponse, type NextRequest } from "next/server"

export const config = {
  matcher: "/api/upload",
}

export function middleware(request: NextRequest) {
  // Her øger vi effektivt bodyparser grænsen for upload router
  // Dette ændrer ikke direkte grænser, men vi kan bruge det til at logge
  console.log("Upload route middleware kørt")

  // Vi returnerer blot request, lad API route håndtere resten
  return NextResponse.next()
}
