"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import imageCompression from "browser-image-compression"
import { Check, ImageIcon, Upload, X } from "lucide-react"

import { uploadPhotoForm } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WeddingPhotoUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState<string>("")
  const [compressionProgress, setCompressionProgress] = useState<number>(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [targetProgress, setTargetProgress] = useState<number>(0)
  const router = useRouter()
  const MAX_IMAGES = 16

  // Effekt til at animere progressbaren mere jævnt
  useEffect(() => {
    if (!isCompressing) return

    let interval: NodeJS.Timeout

    if (compressionProgress < targetProgress) {
      // Gør fremskridt langsommere med et interval
      interval = setInterval(() => {
        setCompressionProgress((prev) => {
          const increment = Math.min(0.5, (targetProgress - prev) / 10)
          const newValue = prev + increment

          // Afrund til én decimal for jævn animation
          return Math.min(parseFloat(newValue.toFixed(1)), targetProgress)
        })
      }, 50) // Opdater hver 50ms for en jævn animation
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCompressing, compressionProgress, targetProgress])

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.8, // Reduceret fra 1MB til 0.8MB for bedre komprimering
      maxWidthOrHeight: 1600, // Reduceret fra 1920 for yderligere komprimering
      useWebWorker: true,
      onProgress: (progress: number) => {
        // Opdater målprocenten, men lad effekten håndtere den faktiske animation
        setTargetProgress(Math.round(progress))
      },
    }

    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error("Fejl under komprimering:", error)
      // Hvis komprimering fejler, returner den oprindelige fil
      return file
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setError(null)
    setSuccess(false)

    if (selectedFiles.length === 0) return

    // Tjek om maksimalt antal billeder overskrides
    if (files.length + selectedFiles.length > MAX_IMAGES) {
      setError(`Du kan maksimalt uploade ${MAX_IMAGES} billeder ad gangen`)
      return
    }

    // Validér hver fil
    const validPreviews: string[] = []

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        setError("Vælg venligst kun billedfiler")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Hvert billede skal være mindre end 10MB")
        return
      }

      validPreviews.push(URL.createObjectURL(file))
    }

    // Først viser vi preview med originale billeder
    setPreviews((prev) => [...prev, ...validPreviews])

    // Komprimerer billederne et efter et
    setUploading(true)
    setIsCompressing(true)
    setCompressionProgress(0)
    setTargetProgress(1) // Start med et lille fremskridt

    const compressedFiles: File[] = []

    try {
      for (const file of selectedFiles) {
        setTargetProgress(0) // Reset ved hvert nyt billede

        // Kunstig forsinkelse for at vise starten af progressbaren
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Gradvis overgang fra 0 til 5% for en mere naturlig start
        setTargetProgress(5)
        await new Promise((resolve) => setTimeout(resolve, 200))

        const compressedFile = await compressImage(file)
        compressedFiles.push(compressedFile)

        // Kort pause mellem hvert billede
        if (selectedFiles.length > 1) {
          setTargetProgress(100)
          await new Promise((resolve) => setTimeout(resolve, 400))
        }
      }

      setFiles((prev) => [...prev, ...compressedFiles])
    } catch (err) {
      console.error("Komprimeringsfejl:", err)
      setError("Komprimering af billeder fejlede. Prøv venligst igen.")
    } finally {
      // Sikr at vi viser 100% til sidst
      setTargetProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setIsCompressing(false)
      setUploading(false)
      setCompressionProgress(0)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      setError("Vælg mindst ét billede")
      return
    }

    if (!name.trim()) {
      setError("Angiv venligst dit navn")
      return
    }

    // Kontrollér filstørrelser inden upload forsøges
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    const maxFileSize = Math.max(...files.map((file) => file.size))

    if (maxFileSize > 5 * 1024 * 1024) {
      setError(
        "Et eller flere billeder er stadig for store. Den største fil er over 5MB."
      )
      return
    }

    if (totalSize > 50 * 1024 * 1024) {
      setError(
        "Den samlede størrelse af dine billeder er for stor (over 50MB). Vælg færre billeder eller billeder i lavere opløsning."
      )
      return
    }

    try {
      setUploading(true)
      setError(null)

      // Brug FormData til at sende filerne
      const formData = new FormData()
      formData.append("name", name.trim())

      // Tilføj alle filer til formData
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Upload via API endpoint i stedet for at kalde server action direkte
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setFiles([])
        setPreviews([])
        setName("")

        // Opdater galleri-dataene
        router.refresh()
      } else {
        setError(
          result.error || "Upload af billeder mislykkedes. Prøv venligst igen."
        )
      }
    } catch (err) {
      console.error("Upload fejl:", err)
      setError("Upload af billeder mislykkedes. Prøv venligst igen.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {success ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Mange tak!</h3>
          <p className="text-gray-500 mb-4">
            Dine billeder er blevet uploadet, og en notifikation er sendt til
            brudeparret!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="destructive"
              onClick={() => setSuccess(false)}
              className="mt-2"
            >
              Upload flere billeder
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/gallery")}
              className="mt-2 bg-rose-100 hover:bg-rose-200 text-rose-700 hidden"
            >
              Se galleri
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-2">
                Dit navn
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Indtast dit navn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
                required
              />
            </div>

            <div className="flex flex-col items-center justify-center">
              {previews.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-rose-500 hover:bg-rose-600 shadow-md"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}

              {compressionProgress > 0 && isCompressing && (
                <div className="w-full mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-rose-500 h-2.5 rounded-full transition-all duration-100 ease-in-out"
                      style={{ width: `${compressionProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {compressionProgress < 100
                      ? `Uploader billeder: ${Math.round(
                          compressionProgress
                        )}% `
                      : "Upload færdig"}
                  </p>
                </div>
              )}

              <Card
                className={`border-dashed border-2 rounded-lg p-6 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors mb-4 bg-rose-100 ${
                  files.length >= MAX_IMAGES || uploading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => {
                  if (files.length < MAX_IMAGES && !uploading) {
                    document.getElementById("photo-upload")?.click()
                  } else if (files.length >= MAX_IMAGES) {
                    setError(
                      `Du kan maksimalt uploade ${MAX_IMAGES} billeder ad gangen`
                    )
                  }
                }}
              >
                <div className="rounded-full bg-rose-100 p-3 mb-2">
                  <ImageIcon className="h-6 w-6 text-rose-500" />
                </div>
                <p className="text-sm font-medium mb-1 text-rose-500">
                  {files.length >= MAX_IMAGES
                    ? "Maksimalt antal billeder nået"
                    : uploading
                    ? "Behandler billeder..."
                    : "Klik for at vælge billeder"}
                </p>
                <p className="text-xs text-gray-600">
                  Vælg de bedste øjeblikke
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Højest {MAX_IMAGES} billeder, max 5MB per billede
                </p>
              </Card>

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                multiple
                disabled={uploading}
              />

              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 transition-all"
              disabled={files.length === 0 || uploading || !name.trim()}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploader...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload{" "}
                  {files.length === 1 ? "billede" : `${files.length} billeder`}
                </span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
