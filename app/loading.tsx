import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your secure notes...</p>
      </div>
    </div>
  )
}
