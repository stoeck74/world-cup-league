"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ChartDonut } from "@phosphor-icons/react"

type SuccessRateCardProps = {
  goodResults: number
  totalFinished: number
}

export function SuccessRateCard({ goodResults, totalFinished }: SuccessRateCardProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const [displayedPercent, setDisplayedPercent] = useState(0)

  const percent = totalFinished > 0 ? Math.round((goodResults / totalFinished) * 100) : 0

  // Calculs SVG (viewBox 100x100, on scale via aspect-square)
  const size = 120
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference - (percent / 100) * circumference

  useEffect(() => {
    if (!circleRef.current) return

    gsap.set(circleRef.current, { strokeDashoffset: circumference })

    gsap.to(circleRef.current, {
      strokeDashoffset: targetOffset,
      duration: 1.4,
      ease: "power3.out",
      delay: 0.3,
    })

    const obj = { value: 0 }
    gsap.to(obj, {
      value: percent,
      duration: 1.4,
      ease: "power3.out",
      delay: 0.3,
      onUpdate: () => setDisplayedPercent(Math.round(obj.value)),
    })
  }, [percent, targetOffset, circumference])

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8 flex flex-col h-full">

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <ChartDonut size={36} weight="light" className="text-lime" />
          <p className="text-xs uppercase tracking-widest text-text-muted">
            Mondial 2026
          </p>
        </div>
        <h3 className="text-xl font-bold text-text-primary">
          Nombre de bon résultats 
        </h3>
      </div>

      {/* Donut — responsive, centré, max 140px */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative w-full max-w-[180px] aspect-square">
<svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90"
        >
          {/* Définition du gradient */}
          <defs>
            <linearGradient id="donut-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="50%" stopColor="#bef264" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>
          </defs>

          {/* Cercle de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />

{/* Filtre glow optionnel */}
          <defs>
            <filter id="donut-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cercle de progression avec gradient + glow */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#donut-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            filter="url(#donut-glow)"
          />
        </svg>

          {/* Chiffre au centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-3xl md:text-4xl font-black text-text-primary tabular-nums">
              {displayedPercent}
              <span className="text-lg font-normal text-text-muted ml-0.5">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer — détail */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-xs uppercase tracking-widest text-text-muted">
          {totalFinished > 0
            ? `${goodResults} / ${totalFinished} matchs`
            : "Pas encore de matchs joués"}
        </p>
      </div>
    </div>
  )
}