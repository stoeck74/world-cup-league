"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

// ============================================
// LEADERBOARD CHART — Classement de la League
// Podium pour le top 3 + liste glassmorph pour le reste
// ============================================

export type LeaderboardEntry = {
  position: number
  username: string
  avatarStyle?: string
  avatarSeed?: string
  points: number
  isMe: boolean
  predictionsMade?: number
  exactScores?: number
}

type LeaderboardChartProps = {
  entries: LeaderboardEntry[]
}

export function LeaderboardChart({ entries }: LeaderboardChartProps) {
  const podiumRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const topThree = entries.slice(0, 3)
  const rest = entries.slice(3)
  const maxPointsInRest = Math.max(...rest.map((e) => e.points), 1)

  useEffect(() => {
    // ===== ANIMATION DU PODIUM =====
    const podium = podiumRef.current
    if (podium) {
      // Sélection des 3 cards (par ordre DOM : 2e gauche, 1er centre, 3e droite)
      const podiumThird = podium.querySelector("[data-podium='3']")
      const podiumSecond = podium.querySelector("[data-podium='2']")
      const podiumFirst = podium.querySelector("[data-podium='1']")

      // État initial : tout en bas, invisible
      gsap.set([podiumFirst, podiumSecond, podiumThird], { opacity: 0, y: 60 })

      // Cascade : 3e d'abord, puis 2e, puis 1er
      const tl = gsap.timeline({ delay: 0.2 })

      if (podiumThird) {
        tl.to(podiumThird, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" })
      }
      if (podiumSecond) {
        tl.to(podiumSecond, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" }, "+=0.1")
      }
      if (podiumFirst) {
        tl.to(podiumFirst, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" }, "+=0.1")
      }

      // Animation pulse continue sur l'avatar du 1er
      const firstAvatar = podium.querySelector("[data-podium-avatar='1']")
      if (firstAvatar) {
        tl.to(firstAvatar, {
          scale: 1.06,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }
    }

    // ===== ANIMATION DE LA LISTE =====
    const list = listRef.current
    if (list) {
      const rows = list.querySelectorAll("[data-row]")
      const bars: Element[] = []
      const labels: Element[] = []
      const targetWidths: string[] = []

      rows.forEach((row) => {
        const bar = row.querySelector("[data-bar]")
        const label = row.querySelector("[data-points]")
        if (bar && label) {
          bars.push(bar)
          labels.push(label)
          targetWidths.push((row as HTMLElement).dataset.targetWidth ?? "0%")
        }
      })

      gsap.set(bars, { width: "0%" })
      gsap.set(labels, { opacity: 0 })

      // Toutes les barres en parallèle, après le podium (~1.5s)
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          width: targetWidths[i],
          duration: 0.7,
          ease: "power3.out",
          delay: 1.6,
        })
      })

      gsap.to(labels, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        delay: 2.3,
      })
    }
  }, [entries])

  return (
    <div className="space-y-6">

      {/* ============================================
          PODIUM TOP 3
          ============================================ */}
      <div
        ref={podiumRef}
        className="grid grid-cols-3 gap-2 items-end"
      
      >
        {topThree[1] && <PodiumCard entry={topThree[1]} tier={2} />}
        {topThree[0] && <PodiumCard entry={topThree[0]} tier={1} isFirst />}
        {topThree[2] && <PodiumCard entry={topThree[2]} tier={3} />}
      </div>

      {/* ============================================
          LISTE — Joueurs 4 et +
          ============================================ */}
      {rest.length > 0 && (
        <div
          ref={listRef}
          className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 overflow-hidden"
        >
          <div className="divide-y divide-white/5">
            {rest.map((entry) => {
              const widthPercent = (entry.points / maxPointsInRest) * 100
              return (
                <ListRow
                  key={entry.username}
                  entry={entry}
                  widthPercent={widthPercent}
                />
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

// ============================================
// PODIUM CARD — Une carte du podium
// ============================================
function PodiumCard({
  entry,
  tier,
  isFirst = false,
}: {
  entry: LeaderboardEntry
  tier: 1 | 2 | 3
  isFirst?: boolean
}) {
  // Tailles selon tier (1er > 2e > 3e)
  const isSecond = tier === 2
  const isThird = tier === 3

  const cardPadding = isFirst
    ? "px-6 py-8 md:px-8 md:py-10"
    : isSecond
    ? "px-5 py-6 md:px-6 md:py-7"
    : "px-4 py-5 md:px-5 md:py-6"

  const numberSize = isFirst
    ? "text-7xl md:text-8xl"
    : isSecond
    ? "text-5xl md:text-6xl"
    : "text-4xl md:text-5xl"

  const numberSuffixSize = isFirst
    ? "text-xl md:text-2xl"
    : isSecond
    ? "text-lg md:text-xl"
    : "text-base md:text-lg"

  const avatarSize = isFirst
    ? "w-24 h-24 md:w-32 md:h-32"
    : isSecond
    ? "w-16 h-16 md:w-20 md:h-20"
    : "w-12 h-12 md:w-16 md:h-16"

  const nameSize = isFirst
    ? "text-lg md:text-2xl"
    : isSecond
    ? "text-sm md:text-base"
    : "text-xs md:text-sm"

  const pointsSize = isFirst
    ? "text-4xl md:text-5xl"
    : isSecond
    ? "text-2xl md:text-3xl"
    : "text-xl md:text-2xl"

  return (
    <div
      data-podium={tier}
      className={`
        flex flex-col items-center text-center
        rounded-2xl ${cardPadding}
        ${isFirst
          ? "bg-gradient-to-br from-lime-300/90 to-lime-600/80 text-bg"
          : "bg-white/[0.04] backdrop-blur-xl border border-white/10"
        }
        ${!isFirst && entry.isMe ? "border-accent/40" : ""}
      `}
    >
      {/* NUMÉRO */}
      <p
        className={`
          font-black tabular-nums leading-none mb-4
          ${numberSize}
          ${isFirst ? "text-bg" : "text-text-muted"}
        `}
      >
        {tier}
        <span className={`${numberSuffixSize} font-bold ${isFirst ? "text-bg/70" : "text-text-muted"}`}>
          {tier === 1 ? "er" : "e"}
        </span>
      </p>

      {/* Avatar */}
      <div
        data-podium-avatar={tier}
        className={`
          ${avatarSize} rounded-full overflow-hidden border-2 shrink-0 mb-3
          ${isFirst ? "border-bg/20" : "border-white/15"}
        `}
      >
        {entry.avatarStyle && entry.avatarSeed ? (
          <img
            src={`https://api.dicebear.com/9.x/${entry.avatarStyle}/svg?seed=${entry.avatarSeed}`}
            alt={entry.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <span className="text-xl font-bold uppercase">
              {entry.username[0]}
            </span>
          </div>
        )}
      </div>

      {/* Username */}
      <p
        className={`
          font-bold truncate max-w-full
          ${nameSize}
          ${isFirst ? "text-bg" : "text-text-primary"}
        `}
      >
        {entry.username}
      </p>
      {entry.isMe && !isFirst && (
        <span className="text-[9px] uppercase tracking-widest font-bold text-lime mt-1">
          Moi
        </span>
      )}

      {/* Points */}
      <p
        className={`
          font-black tabular-nums mt-3
          ${pointsSize}
          ${isFirst ? "text-bg" : "text-text-primary"}
        `}
      >
        {entry.points}
        <span
          className={`
            text-xs font-normal ml-1
            ${isFirst ? "text-bg/60" : "text-text-muted"}
          `}
        >
          pts
        </span>
      </p>
    </div>
  )
}

// ============================================
// LIST ROW — Ligne pour joueurs 4 et plus
// ============================================
function ListRow({
  entry,
  widthPercent,
}: {
  entry: LeaderboardEntry
  widthPercent: number
}) {
  return (
    <div
      data-row
      data-target-width={`${widthPercent}%`}
      className={`
        flex items-center gap-4 px-4 py-2.5 transition-colors
        ${entry.isMe ? "bg-accent/[0.06]" : "hover:bg-white/[0.02]"}
      `}
    >
      {/* GAUCHE FIXE : position + avatar + nom */}
      <div className="flex items-center gap-3 shrink-0 w-[220px]">

        {/* Position en gros */}
        <span
          className={`
            text-4xl font-black w-9 shrink-0
            ${entry.isMe ? "text-white" : "text-text-muted"}
          `}
        >
          {entry.position}
        </span>

        {/* Avatar */}
        <div
          className={`
            w-9 h-9 rounded-full overflow-hidden shrink-0 border
            ${entry.isMe ? "border-accent/40" : "border-white/10"}
          `}
        >
          {entry.avatarStyle && entry.avatarSeed ? (
            <img
              src={`https://api.dicebear.com/9.x/${entry.avatarStyle}/svg?seed=${entry.avatarSeed}`}
              alt={entry.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-xs font-bold uppercase text-text-secondary">
                {entry.username[0]}
              </span>
            </div>
          )}
        </div>

        {/* Username */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span
            className={`
              text-md font-semibold truncate
              ${entry.isMe ? "text-text-primary" : "text-text-secondary"}
            `}
          >
            {entry.username}
          </span>
          {entry.isMe && (
            <span className="text-[9px] uppercase tracking-widest font-bold text-accent shrink-0">
              Moi
            </span>
          )}
        </div>
      </div>

      {/* ZONE BARRE */}
      <div className="flex-1 min-w-0">
        <div
          data-bar
          className="h-12 rounded-md flex items-center justify-end pr-3 bg-gradient-to-r from-blue-400/80 to-blue-600/50"
          style={{ width: "0%" }}
        >
          <span
            data-points
            className="text-xl font-black tabular-nums whitespace-nowrap text-text-primary"
          >
            {entry.points}
            <span className="text-xs font-normal ml-1">
              pts
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}