import { HeartIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  text?: string
  size?: "sm" | "md" | "lg"
  variant?: "heart" | "spinner"
}

export function LoadingSpinner({
  className,
  text = "Indlæser...",
  size = "md",
  variant = "heart",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  if (variant === "spinner") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <svg
          className={cn("animate-spin text-rose-400 mb-2", sizeClasses[size])}
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
        <p className={cn("text-gray-600", textSizeClasses[size])}>{text}</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <HeartIcon
        className={cn(
          "text-rose-400 animate-heart-beat mb-2",
          sizeClasses[size]
        )}
      />
      <p className={cn("text-gray-600", textSizeClasses[size])}>{text}</p>
    </div>
  )
}
