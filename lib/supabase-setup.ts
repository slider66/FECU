"use server"

import { supabase } from "./supabase"

const BUCKET_NAME = "wedding-photos"

export async function setupSupabaseStorage() {
  try {
    // Tjek om bucketen allerede eksisterer
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets()

    if (listError) {
      throw new Error(`Kunne ikke hente buckets: ${listError.message}`)
    }

    const bucketExists = buckets.some((bucket) => bucket.name === BUCKET_NAME)

    if (!bucketExists) {
      // Opret en ny bucket
      const { error: createError } = await supabase.storage.createBucket(
        BUCKET_NAME,
        {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        }
      )

      if (createError) {
        throw new Error(`Kunne ikke oprette bucket: ${createError.message}`)
      }

      console.log(`Supabase Storage bucket '${BUCKET_NAME}' oprettet`)

      // Sæt offentlig adgang til
      try {
        supabase.storage.from(BUCKET_NAME).getPublicUrl("dummy")
        console.log("Offentlig adgang sat op")
      } catch (policyError) {
        console.warn(`Kunne ikke sætte offentlig adgang: ${policyError}`)
      }
    } else {
      console.log(`Supabase Storage bucket '${BUCKET_NAME}' findes allerede`)
    }

    return { success: true }
  } catch (error) {
    console.error("Fejl ved opsætning af Supabase Storage:", error)
    return { success: false, error }
  }
}
