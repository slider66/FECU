"use client"

import { useEffect } from "react"

export function InitSupabase() {
  useEffect(() => {
    // Middleware håndterer nu opsætningen af Supabase
    // Vi behøver ikke længere at kalde en ekstern API-endpoint
    console.log("Supabase konfiguration håndteres nu af middleware")
  }, [])

  // Denne komponent renderer intet UI
  return null
}
