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
    // Reduceret antal hjerter for bedre performance
    const newHearts: Heart[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0-100% fra venstre
      delay: Math.random() * 4, // 0-4 sekunder delay
      duration: 6 + Math.random() * 3, // 6-9 sekunder duration (langsommere)
      size: 14 + Math.random() * 6, // 14-20px størrelse (mindre)
    }))

    setHearts(newHearts)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 w-full h-full">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 animate-float-up-smooth opacity-0 will-change-transform"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            animationFillMode: "forwards",
            transform: "translateZ(0)", // Hardware acceleration
          }}
        >
          <HeartIcon
            className="text-rose-400/40 fill-rose-400/20"
            style={{
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              filter: "blur(0.5px)", // Subtle blur for softer look
            }}
          />
        </div>
      ))}
    </div>
  )
}
