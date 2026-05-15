"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { FakeGroup } from "@/lib/fake-data/groups"

type GroupStageProps = {
  groups: FakeGroup[]
}

// ============================================
// GROUP STAGE — 12 mini-classements de 4 équipes
//
// Style : carte glassmorph, accent bleu sur les 2 premiers
// (qualifiés directs pour les KO).
// ============================================

export function GroupStage({ groups }: GroupStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation stagger d'entrée
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll("[data-group-card]")

    gsap.set(cards, { opacity: 0, y: 24 })
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: "power3.out",
      delay: 0.1,
    })
  }, [groups])

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {groups.map((group) => (
        <GroupCard key={group.letter} group={group} />
      ))}
    </div>
  )
}

// ============================================
// GROUP CARD — Une mini-table de 4 équipes
// ============================================

function GroupCard({ group }: { group: FakeGroup }) {
  return (
    <div
      data-group-card
      className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/40 backdrop-blur-xl p-4 md:p-5" 
    >
      {/* Header : lettre du groupe */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm tracking-tight text-text-muted">
            Groupe
          </span>
          <span className="text-2xl font-black text-accent">
            {group.letter}
          </span>
        </div>
      </div>

      {/* Mini-table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-text-muted">
            <th className="text-left font-medium pb-2 w-6">#</th>
            <th className="text-left font-medium pb-2">Équipe</th>
            <th className="text-center font-medium pb-2 w-6">J</th>
            <th className="text-center font-medium pb-2 w-8">DB</th>
            <th className="text-right font-medium pb-2 w-8">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.table.map((row) => {
            const isQualified = row.position <= 2
            return (
              <tr
                key={row.team.tla}
                className={`border-t border-white/5 ${
                  isQualified ? "" : "opacity-60"
                }`}
              >
                <td className="py-2.5">
                  <span
                    className={`text-xs font-bold ${
                      isQualified ? "text-accent" : "text-text-muted"
                    }`}
                  >
                    {row.position}
                  </span>
                </td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-text-muted shrink-0 w-8">
                      {row.team.tla}
                    </span>
                    <span className="text-sm font-medium text-text-primary truncate hidden sm:inline">
                      {row.team.shortName}
                    </span>
                  </div>
                </td>
                <td className="text-center py-2.5 text-text-secondary tabular-nums">
                  {row.playedGames}
                </td>
                <td className="text-center py-2.5 tabular-nums">
                  <span
                    className={
                      row.goalDifference > 0
                        ? "text-accent"
                        : row.goalDifference < 0
                        ? "text-text-muted"
                        : "text-text-secondary"
                    }
                  >
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </span>
                </td>
                <td className="text-right py-2.5">
                  <span
                    className={`font-bold ${
                      isQualified ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    {row.points}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Légende discrète */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-[10px] uppercase tracking-widest text-text-muted">
          Qualifiés 1/16e
        </span>
      </div>
    </div>
  )
}