"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, ImageIcon, Upload, X } from "lucide-react"

import { uploadPhoto } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function WeddingPhotoUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    setSuccess(false)

    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      setError("Vælg venligst en billedfil")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Billedet skal være mindre end 10MB")
      return
    }

    setFile(selectedFile)
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setUploading(true)
      await uploadPhoto(file)
      setSuccess(true)
      setFile(null)
      setPreview(null)
      // Refresh the gallery data
      router.refresh()
    } catch (err) {
      setError("Upload af billedet mislykkedes. Prøv venligst igen.")
      console.error(err)
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
            Dit billede er blevet uploadet, og en notifikation er sendt til
            brudeparret!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="destructive"
              onClick={() => setSuccess(false)}
              className="mt-2"
            >
              Upload et andet billede
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/gallery")}
              className="mt-2 bg-rose-100 hover:bg-rose-200 text-rose-700"
            >
              Se galleri
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              {preview ? (
                <div className="relative w-full aspect-square mb-4">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-rose-500 hover:bg-rose-600 shadow-md"
                    onClick={() => {
                      setFile(null)
                      setPreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Card
                  className="border-dashed border-2 rounded-lg p-6 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors mb-4"
                  onClick={() =>
                    document.getElementById("photo-upload")?.click()
                  }
                >
                  <div className="rounded-full bg-rose-100 p-3 mb-2">
                    <ImageIcon className="h-6 w-6 text-rose-500" />
                  </div>
                  <p className="text-sm font-medium mb-1 text-rose-400">
                    Klik for at vælge et billede
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF op til 10MB
                  </p>
                </Card>
              )}

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 transition-all"
              disabled={!file || uploading}
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
                  Upload billede
                </span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
