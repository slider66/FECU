"use client"

import { useEffect } from "react"

import { setupSupabaseStorage } from "@/lib/supabase-setup"

export function InitSupabase() {
  useEffect(() => {
    // Direkte kald til setupSupabaseStorage i stedet for via API
    async function initSupabase() {
      try {
        const result = await setupSupabaseStorage()

        if (result.success) {
          console.log("Supabase storage konfigureret korrekt")
        } else {
          console.warn(
            "Bemærkning ved opsætning af Supabase storage:",
            result.warning || ""
          )
        }
      } catch (error) {
        // Vi logger blot fejlen, men lader appen fortsætte
        console.error("Fejl ved initialisering af Supabase storage:", error)
      }
    }

    // Starter Supabase-initialisering
    initSupabase()
  }, [])

  // Denne komponent renderer intet UI
  return null
}
