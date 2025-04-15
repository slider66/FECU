"use client"

import { useEffect } from "react"

export function InitSupabase() {
  useEffect(() => {
    // Kald setup endpointet ved app start
    async function initSupabase() {
      try {
        const response = await fetch("/api/setup")
        const data = await response.json()

        if (data.success) {
          console.log("Supabase initialiseret korrekt")
        } else {
          console.error("Fejl ved initialisering af Supabase:", data.error)
        }
      } catch (error) {
        console.error("Kunne ikke initialisere Supabase:", error)
      }
    }

    initSupabase()
  }, [])

  // Denne komponent renderer intet UI
  return null
}
