"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import confetti from "canvas-confetti"
import { Trophy } from "@phosphor-icons/react"

type PositionPopProps = {
  position: number
  totalPlayers: number
  points: number
  gapToLeader: number
  isLeader: boolean
  pointsLastStage: number
  predictionsMade: number
  totalMatches: number
}

export function PositionPop({
  position,
  totalPlayers,
  points,
  gapToLeader,
  isLeader,
  pointsLastStage,
  predictionsMade,
  totalMatches,
}: PositionPopProps) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const suffixRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!numberRef.current || !suffixRef.current) return

    const tl = gsap.timeline({ delay: 0.3 })

    tl.fromTo(
      [numberRef.current, suffixRef.current],
      {
        scale: 0,
        rotation: -25,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
      }
    )

    setTimeout(() => {
      const rect = numberRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      // Couleurs adaptées au podium
      const colors =
        position === 1
          ? ["#fbbf24", "#fde68a", "#2196f3", "#ffffff"]      // Or pour le 1er
          : position === 2
          ? ["#cbd5e1", "#e2e8f0", "#2196f3", "#ffffff"]      // Argent pour le 2e
          : position === 3
          ? ["#d97706", "#fbbf24", "#2196f3", "#ffffff"]      // Bronze pour le 3e
          : ["#2196f3", "#304fff", "#ffffff", "#fde68a"]       // Bleu accent pour les autres

confetti({
        particleCount: position === 1 ? 120 : 80,
        spread: 80,
        startVelocity: 35,
        origin: { x, y },
        colors,
        scalar: 0.9,
        gravity: 1.8,       // Plus de gravité = chute plus rapide (défaut 1)
        ticks: 100,         // Durée de vie en frames (défaut 200 = ~3s, 100 = ~1.5s)
      })
    }, 600)
  }, [position, isLeader])

  return (
    <>
      {/* Badge contextuel en haut à droite */}
      {isLeader && (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-3 py-1">
          <Trophy size={14} weight="fill" className="text-yellow-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
            Leader
          </span>
        </div>
      )}

      <div className="flex items-center gap-6 h-full mt-2">
        {/* GAUCHE : Numéro géant */}
        <div className="flex items-baseline shrink-0">
          <span
            ref={numberRef}
            className="text-[7vw] font-black text-primary leading-none inline-block origin-bottom"
          >
            {position}
          </span>
          <span
            ref={suffixRef}
            className="text-6xl text-primary font-bold inline-block origin-bottom"
          >
            e
          </span>
        </div>

        {/* DROITE : Liste des infos avec lignes de séparation */}
        <div className="flex-1 min-w-0 divide-y divide-white/10 border-y border-white/10">

          {/* Total points */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs uppercase tracking-widest text-text-secondary">
              Total points
            </span>
            <span className="text-lg font-bold text-text-primary">{points}</span>
          </div>

          {/* Tendance */}
          {pointsLastStage > 0 && (
            <div className="flex items-center justify-between py-2.5">
              <span className="text-xs uppercase tracking-widest text-text-secondary">
                Récent
              </span>
              <span className="text-lg font-bold text-text-primary">+{pointsLastStage}</span>
            </div>
          )}

          {/* Statut */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs uppercase tracking-widest text-text-secondary">
              Statut
            </span>
            <span className="text-sm font-semibold text-text-primary text-right">
              {isLeader
                ? "Leader 👑"
                : gapToLeader > 0
                ? `À ${gapToLeader} pt${gapToLeader > 1 ? "s" : ""} du 1er`
                : `${totalPlayers} joueur${totalPlayers > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Pronos faits */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs uppercase tracking-widest text-text-secondary">
              Pronos faits
            </span>
            <span className="text-lg font-bold text-text-primary">
              {predictionsMade}
              <span className="text-text-secondary text-sm font-normal ml-1">
                / {totalMatches}
              </span>
            </span>
          </div>

        </div>
      </div>
    </>
  )
}