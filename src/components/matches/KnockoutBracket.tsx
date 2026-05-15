"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { MatchCard } from "./MatchCard"
import { savePrediction } from "@/lib/actions/predictions"
import {
  fakeRound32Matches,
  fakeRound16Matches,
  fakeQuarterMatches,
  fakeSemiMatches,
  fakeFinalMatches,
  fakeThirdPlaceMatches,
  type FakeMatchDetailed,
} from "@/lib/fake-data/matches"

// ============================================
// KNOCKOUT BRACKET — Coupe du Monde 2026
//
// 2 sous-onglets :
//  - "1/16e de finale" : grid avec MatchCard complet
//  - "Tableau final" : bracket symétrique 6 colonnes
// ============================================

type SubTab = "R32" | "BRACKET"

type PredictionEntry = {
  home: number | null
  away: number | null
  qualifier: string | null
}

export function KnockoutBracket() {
  const [subTab, setSubTab] = useState<SubTab>("R32")
  const containerRef = useRef<HTMLDivElement>(null)

  // State des pronos partagé R32 + bracket
const [predictions, setPredictions] = useState<Map<string, PredictionEntry>>(new Map())
  const dirtyMatchIds = useRef<Set<string>>(new Set())
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const [justSavedIds, setJustSavedIds] = useState<Set<string>>(new Set())

  const performSave = async (matchId: string) => {
    const pred = predictions.get(matchId)
    if (!pred) return
    const result = await savePrediction(matchId, pred.home, pred.away, pred.qualifier)
    if (result.ok) {
      dirtyMatchIds.current.delete(matchId)
      setJustSavedIds((prev) => new Set(prev).add(matchId))
      setTimeout(() => {
        setJustSavedIds((prev) => {
          const next = new Set(prev)
          next.delete(matchId)
          return next
        })
      }, 1800)
    } else {
      console.error("Save failed:", result.error)
    }
  }

  const handlePredictionChange = (
    matchId: string,
    home: number | null,
    away: number | null,
    qualifier: string | null
  ) => {
    setPredictions((prev) => {
      const next = new Map(prev)
      next.set(matchId, { home, away, qualifier })
      return next
    })

    dirtyMatchIds.current.add(matchId)
    const existing = debounceTimers.current.get(matchId)
    if (existing) clearTimeout(existing)
    const timer = setTimeout(() => {
      performSave(matchId)
      debounceTimers.current.delete(matchId)
    }, 1500)
    debounceTimers.current.set(matchId, timer)
  }

  const handleLeaveCard = (matchId: string) => {
    if (!dirtyMatchIds.current.has(matchId)) return
    const existing = debounceTimers.current.get(matchId)
    if (existing) {
      clearTimeout(existing)
      debounceTimers.current.delete(matchId)
    }
    performSave(matchId)
  }

  // Animations
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cards = container.querySelectorAll("[data-bracket-card]")
    gsap.set(cards, { opacity: 0, y: 16 })
    gsap.to(cards, {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.02,
      ease: "power3.out", delay: 0.1,
    })
  }, [subTab])

  return (
    <div>
      {/* Sous-onglets */}
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setSubTab("R32")}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all
            ${subTab === "R32"
              ? "bg-white/10 text-text-primary border border-white/20"
              : "bg-white/[0.02] border border-white/5 text-text-muted hover:bg-white/[0.06] hover:text-text-secondary"
            }
          `}
        >
          1/16e de finale
        </button>
        <button
          type="button"
          onClick={() => setSubTab("BRACKET")}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all
            ${subTab === "BRACKET"
              ? "bg-white/10 text-text-primary border border-white/20"
              : "bg-white/[0.02] border border-white/5 text-text-muted hover:bg-white/[0.06] hover:text-text-secondary"
            }
          `}
        >
          Tableau final
        </button>
      </div>

      {/* Contenu */}
      <div ref={containerRef}>
{subTab === "R32" ? (
          <Round32Grid
            matches={fakeRound32Matches}
            predictions={predictions}
            onPredictionChange={handlePredictionChange}
            onLeaveCard={handleLeaveCard}
            justSavedIds={justSavedIds}
          />
        ) : (
          <FinalBracket
            predictions={predictions}
            onPredictionChange={handlePredictionChange}
            onLeaveCard={handleLeaveCard}
            justSavedIds={justSavedIds}
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// 1/16e DE FINALE — Grid
// ============================================
function Round32Grid({
  matches,
  predictions,
  onPredictionChange,
  onLeaveCard,
  justSavedIds,
}: {
  matches: FakeMatchDetailed[]
  predictions: Map<string, PredictionEntry>
  onPredictionChange: (
    matchId: string,
    home: number | null,
    away: number | null,
    qualifier: string | null
  ) => void
  onLeaveCard: (matchId: string) => void
  justSavedIds: Set<string>
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {matches.map((match) => {
        const pred = predictions.get(match.id) ?? { home: null, away: null, qualifier: null }
        return (
          <div key={match.id} data-bracket-card>
            <MatchCard
              match={match}
              homePrediction={pred.home}
              awayPrediction={pred.away}
              qualifierPrediction={pred.qualifier}
              stageStatus="current"
              onPredictionChange={onPredictionChange}
              onLeaveCard={onLeaveCard}
              justSaved={justSavedIds.has(match.id)}
            />
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// TABLEAU FINAL — Bracket symétrique 6 colonnes
// ============================================
function FinalBracket({
  predictions,
  onPredictionChange,
  onLeaveCard,
  justSavedIds,
}: {
  predictions: Map<string, PredictionEntry>
  onPredictionChange: (
    matchId: string,
    home: number | null,
    away: number | null,
    qualifier: string | null
  ) => void
  onLeaveCard: (matchId: string) => void
  justSavedIds: Set<string>
}) {
  const round16Left = fakeRound16Matches.filter((m) =>
    ["r16-89", "r16-90", "r16-93", "r16-94"].includes(m.id)
  )
  const quarterLeft = fakeQuarterMatches.filter((m) => ["qf-97", "qf-98"].includes(m.id))
  const semiLeft = fakeSemiMatches.find((m) => m.id === "sf-101")

  const round16Right = fakeRound16Matches.filter((m) =>
    ["r16-91", "r16-92", "r16-95", "r16-96"].includes(m.id)
  )
  const quarterRight = fakeQuarterMatches.filter((m) => ["qf-99", "qf-100"].includes(m.id))
  const semiRight = fakeSemiMatches.find((m) => m.id === "sf-102")

  const renderMatch = (match: FakeMatchDetailed) => {
    const pred = predictions.get(match.id) ?? { home: null, away: null, qualifier: null }
    return (
      <div data-bracket-card>
            <MatchCard
              match={match}
              homePrediction={pred.home}
              awayPrediction={pred.away}
              qualifierPrediction={pred.qualifier}
              stageStatus="current"
              onPredictionChange={onPredictionChange}
              onLeaveCard={onLeaveCard}
              justSaved={justSavedIds.has(match.id)}
            />
      </div>
    )
  }

  return (
    <>
      {/* Grid 6 colonnes pleine largeur */}
      <div className="grid grid-cols-6 gap-3 md:gap-4">

        {/* Col 1 : 1/8e GAUCHE */}
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-center text-text-muted">
            1/8e
          </p>
          <div className="flex flex-col gap-3">
            {round16Left.map((m) => (
              <div key={m.id}>{renderMatch(m)}</div>
            ))}
          </div>
        </div>

        {/* Col 2 : Quarts GAUCHE */}
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-center text-text-muted">
            Quarts
          </p>
          <div className="flex flex-col justify-around flex-1 gap-3">
            {quarterLeft.map((m) => (
              <div key={m.id}>{renderMatch(m)}</div>
            ))}
          </div>
        </div>

        {/* Col 3 : Demi GAUCHE */}
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-center text-text-muted">
            Demi
          </p>
          <div className="flex flex-col justify-center flex-1">
            {semiLeft && <div key={semiLeft.id}>{renderMatch(semiLeft)}</div>}
          </div>
        </div>

        {/* Col 4 : Demi DROITE */}
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-center text-text-muted">
            Demi
          </p>
          <div className="flex flex-col justify-center flex-1">
            {semiRight && <div key={semiRight.id}>{renderMatch(semiRight)}</div>}
          </div>
        </div>

        {/* Col 5 : Quarts DROITE */}
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-center text-text-muted">
            Quarts
          </p>
          <div className="flex flex-col justify-around flex-1 gap-3">
            {quarterRight.map((m) => (
              <div key={m.id}>{renderMatch(m)}</div>
            ))}
          </div>
        </div>

        {/* Col 6 : 1/8e DROITE */}
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-center text-text-muted">
            1/8e
          </p>
          <div className="flex flex-col gap-3">
            {round16Right.map((m) => (
              <div key={m.id}>{renderMatch(m)}</div>
            ))}
          </div>
        </div>

      </div>

      {/* Finale — col 3+4 sous le bracket */}
      <div className="grid grid-cols-6 gap-3 md:gap-4 mt-6">
        <div className="col-start-3 col-span-2 flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-center text-accent">
            Finale
          </p>
          {fakeFinalMatches.map((m) => (
            <div key={m.id}>{renderMatch(m)}</div>
          ))}
        </div>
      </div>

      {/* Petite finale */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
        <div className="w-full max-w-md">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2 text-center">
            Petite finale (3e place)
          </p>
          {fakeThirdPlaceMatches.map((m) => (
            <div key={m.id}>{renderMatch(m)}</div>
          ))}
        </div>
      </div>
    </>
  )
}