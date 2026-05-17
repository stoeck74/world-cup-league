"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

type HeroProgressBarProps = {
  predictionsMade: number
  matchesCount: number
}

export function HeroProgressBar({ predictionsMade, matchesCount }: HeroProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null)
  const [displayedCount, setDisplayedCount] = useState(0)

  const percent = matchesCount > 0 ? Math.round((predictionsMade / matchesCount) * 100) : 0

  // Animation au mount
  useEffect(() => {
    // Anime la barre
    if (fillRef.current) {
      gsap.fromTo(
        fillRef.current,
        { width: "0%" },
        {
          width: `${percent}%`,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.2,
        }
      )
    }

    // Compteur animé
    const obj = { value: 0 }
    gsap.to(obj, {
      value: predictionsMade,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.2,
      onUpdate: () => setDisplayedCount(Math.round(obj.value)),
    })
  }, [predictionsMade, percent])

  return (
    <div>
      {/* Texte */}
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm text-text-secondary">
          <span className="text-text-primary font-bold tabular-nums">{displayedCount}</span>
          <span className="text-text-muted"> / {matchesCount} pronos</span>
        </p>
        <p className="text-xs uppercase tracking-widest text-text-muted tabular-nums">
          {percent}%
        </p>
      </div>

      {/* Barre */}
      <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          ref={fillRef}
          className="absolute inset-y-0 left-0 bg-lime-300 rounded-full"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  )
}