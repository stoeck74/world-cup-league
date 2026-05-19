"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Target } from "@phosphor-icons/react"

type ExactScoresCardProps = {
  exactScores: number
  totalFinished: number
}

export function ExactScoresCard({ exactScores, totalFinished }: ExactScoresCardProps) {
  const ring1Ref = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const ring3Ref = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLParagraphElement>(null)
  const [displayedCount, setDisplayedCount] = useState(0)

  useEffect(() => {
    // Pulse one-shot (3 anneaux décalés) au load
    const rings = [ring1Ref.current, ring2Ref.current, ring3Ref.current]
    rings.forEach((ring, i) => {
      if (!ring) return
      gsap.set(ring, { opacity: 0.8, scale: 1, borderWidth: 2 })
      gsap.to(ring, {
        opacity: 0,
        scale: 2.2,
        borderWidth: 0.5,
        duration: 1.8,
        delay: 0.3 + i * 0.3,
        ease: "power2.out",
      })
    })

    // Count up du chiffre
    if (numberRef.current) {
      gsap.fromTo(
        numberRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.5)" }
      )
    }

    const obj = { value: 0 }
    gsap.to(obj, {
      value: exactScores,
      duration: 1.2,
      delay: 0.3,
      ease: "power2.out",
      onUpdate: () => setDisplayedCount(Math.round(obj.value)),
    })
  }, [exactScores])

  return (
    <div className="rounded-2xl bg-white/3 border border-white/10 backdrop-blur-xl p-6 md:p-8 flex flex-col h-full overflow-hidden">
      <div className="absolute -bottom-1/3 right-0 w-full h-1/2 bg-accent/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-1/3 left-1/4 w-1/2 h-1/4 bg-blue-300 rounded-full blur-3xl pointer-events-none" />
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Target size={36} weight="light" className="text-accent" />
          <p className="text-xs uppercase tracking-widest text-text-muted">
            Précision
          </p>
        </div>
        <h3 className="text-xl font-bold text-text-primary">
          Scores exacts
        </h3>
      </div>

      {/* Zone visuelle — chiffre + anneaux qui pulsent au load */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative flex items-center justify-center w-full aspect-square max-w-[250px]">
          {/* Anneaux */}
          <div
            ref={ring1Ref}
            className="absolute w-1/2 h-1/2 border-accent rounded-full"
            style={{ opacity: 0 }}
          />
          <div
            ref={ring2Ref}
            className="absolute w-1/2 h-1/2 border-accent rounded-full"
            style={{ opacity: 0 }}
          />
          <div
            ref={ring3Ref}
            className="absolute w-1/2 h-1/2 border-accent rounded-full"
            style={{ opacity: 0 }}
          />

          {/* Chiffre central */}
          <p
            ref={numberRef}
            className="relative text-6xl md:text-[4.5vw] font-black tabular-nums"
            style={{
              background: "linear-gradient(135deg, #2196f3, #21a9f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {displayedCount}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-xs uppercase tracking-widest text-neutral-300">
          {totalFinished > 0
            ? `sur ${totalFinished} pronos joués`
            : "Pas encore de matchs joués"}
        </p>
      </div>
    </div>
  )
}