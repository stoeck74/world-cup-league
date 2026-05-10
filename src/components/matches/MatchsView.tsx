"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { gsap } from "gsap"
import { ClockCountdown } from "@phosphor-icons/react"
import { MatchCard } from "./MatchCard"
import {
  getMatchesByStage,
  type FakeMatchDetailed,
  type FakeStage,
  type FakeStageInfo,
} from "@/lib/fake-data/matches"

type MatchsViewProps = {
  matches: FakeMatchDetailed[]
  stages: FakeStageInfo[]
  currentStage: FakeStage
}

// ============================================
// MATCHS VIEW — Coupe du Monde 2026
//
// Différences vs Panenka League / Ligue 1 :
//  - Pas de banco
//  - "Phase" au lieu de "Journée" (poules, 1/16e, 1/8e, etc.)
//  - Pas tous les matchs de toutes les phases en une fois (KO sont incrémentaux)
// ============================================

export function MatchsView({
  matches,
  stages,
  currentStage,
}: MatchsViewProps) {
  const [selectedStage, setSelectedStage] = useState<FakeStage>(currentStage)

  const selectedStageInfo = stages.find((s) => s.key === selectedStage)
  const stageStatus = selectedStageInfo?.status ?? "future"

  // Matchs de la phase sélectionnée
  const displayedMatches = useMemo(
    () => getMatchesByStage(selectedStage),
    [selectedStage]
  )

  // ============================================
  // STATE GLOBAL DES PRONOS
  // ============================================
  const [predictions, setPredictions] = useState<
    Map<string, { home: number | null; away: number | null }>
  >(new Map())

  useEffect(() => {
    const newPredictions = new Map<
      string,
      { home: number | null; away: number | null }
    >()
    displayedMatches.forEach((m) => {
      newPredictions.set(m.id, {
        home: m.myHomePrediction ?? null,
        away: m.myAwayPrediction ?? null,
      })
    })
    setPredictions(newPredictions)
  }, [displayedMatches])

  // Refs pour animations GSAP
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  // ============================================
  // STATS DE LA PHASE
  // ============================================
  const stats = useMemo(() => {
    const total = displayedMatches.length
    let predictionsMade = 0
    predictions.forEach((p) => {
      if (p.home !== null && p.away !== null) predictionsMade++
    })
    return { total, predictionsMade }
  }, [predictions, displayedMatches])

  // ============================================
  // HANDLERS
  // ============================================
  const handlePredictionChange = (
    matchId: string,
    home: number | null,
    away: number | null
  ) => {
    setPredictions((prev) => {
      const next = new Map(prev)
      next.set(matchId, { home, away })
      return next
    })
  }

  // ============================================
  // ANIMATION GSAP — Entrée stagger
  // ============================================
  useEffect(() => {
    const header = headerRef.current
    const tabs = tabsRef.current
    const cards = cardsRef.current

    if (!header || !tabs || !cards) return

    const elements = [header, tabs, ...cards.children]

    gsap.set(elements, { opacity: 0, y: 24 })

    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.1,
    })
  }, [selectedStage])

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">

        {/* HEADER */}
        <header ref={headerRef} className="mb-8">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            Pronostics
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                <span className="text-accent">{selectedStageInfo?.label ?? "Phase"}</span>
              </h1>
              <p className="text-text-secondary mt-1">
                Compose tes pronos avant le coup d&apos;envoi
              </p>
            </div>

            {/* Stats à droite */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                  Pronos
                </p>
                <p className="text-2xl font-black text-text-primary">
                  {stats.predictionsMade}
                  <span className="text-text-muted text-base font-normal ml-1">
                    / {stats.total}
                  </span>
                </p>
              </div>

              <div className="hidden lg:block">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1">
                  <ClockCountdown size={12} weight="bold" />
                  Coup d&apos;envoi
                </p>
                <p className="text-2xl font-black text-text-primary tabular-nums">
                  À venir
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* SÉLECTEUR DE PHASE */}
        <div ref={tabsRef} className="mb-8 -mx-4 md:mx-0">
          <div className="flex gap-2 overflow-x-auto pb-2 px-4 md:px-0 scrollbar-hide">
            {stages.map((stage) => (
              <button
                key={stage.key}
                type="button"
                onClick={() => setSelectedStage(stage.key)}
                className={`
                  shrink-0 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all
                  ${selectedStage === stage.key
                    ? "bg-accent text-bg"
                    : "bg-white/[0.03] border border-white/10 text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
                  }
                `}
              >
                {stage.label}
                {stage.status === "current" && selectedStage !== stage.key && (
                  <span className="ml-2 inline-block w-1.5 h-1.5 bg-accent rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* LISTE DES MATCHS */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {displayedMatches.length === 0 ? (
            <div className="col-span-full rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-12 text-center text-text-muted">
              Aucun match disponible pour cette phase
            </div>
          ) : (
            displayedMatches.map((match) => {
              const prediction = predictions.get(match.id) ?? { home: null, away: null }
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  homePrediction={prediction.home}
                  awayPrediction={prediction.away}
                  stageStatus={stageStatus}
                  onPredictionChange={handlePredictionChange}
                />
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}
