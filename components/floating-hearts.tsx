"use client"

import { useEffect, useState } from "react"
import { HeartIcon } from "lucide-react"

interface Heart {
  id: number
  left: number
  delay: number
  duration: number
  size: number
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    // Generer hjerter med tilfældige positioner og timing
    const newHearts: Heart[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0-100% fra venstre
      delay: Math.random() * 3, // 0-3 sekunder delay
      duration: 4 + Math.random() * 2, // 4-6 sekunder duration
      size: 16 + Math.random() * 8, // 16-24px størrelse
    }))

    setHearts(newHearts)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 w-full h-full">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 animate-float-up opacity-0"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            animationFillMode: "forwards",
          }}
        >
          <HeartIcon
            className="text-rose-400/60 fill-rose-400/40"
            style={{ width: `${heart.size}px`, height: `${heart.size}px` }}
          />
        </div>
      ))}
    </div>
  )
}
