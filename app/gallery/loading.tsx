import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 flex items-center justify-center">
      <LoadingSpinner text="Indlæser galleri..." size="lg" />
    </main>
  )
}
