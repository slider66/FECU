import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FloatingHearts } from "@/components/floating-hearts"

export default function Loading() {
  return (
    <>
      <FloatingHearts />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 flex items-center justify-center">
        <LoadingSpinner text="Indlæser..." size="lg" />
      </main>
    </>
  )
}
