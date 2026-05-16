"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { gsap } from "gsap"
import { MatchCard } from "./MatchCard"
import { KnockoutBracket } from "./KnockoutBracket"
import { savePrediction } from "@/lib/actions/predictions"
import {
  type FakeMatchDetailed,
  type FakeStage,
  type FakeStageInfo,
  fakeGroupLetters,
} from "@/lib/fake-data/matches"

type MatchsViewProps = {
  matches: FakeMatchDetailed[]
  stages: FakeStageInfo[]
  currentStage: FakeStage
}

type MainTab = "POULES" | "FINALE"

// ============================================
// MATCHS VIEW — Coupe du Monde 2026
// ============================================

export function MatchsView({
  matches,
  stages,
  currentStage,
}: MatchsViewProps) {
  const [mainTab, setMainTab] = useState<MainTab>(
    currentStage === "GROUP" ? "POULES" : "FINALE"
  )
  const [selectedGroup, setSelectedGroup] = useState<string>("A")

  // Matchs filtrés par groupe
  const displayedMatches = useMemo(() => {
    if (mainTab !== "POULES") return []
    return matches.filter((m) => m.stage === "GROUP" && m.group === selectedGroup)
  }, [matches, mainTab, selectedGroup])

  // ============================================
  // STATE DES PRONOS + AUTO-SAVE
  // ============================================
  const [predictions, setPredictions] = useState<Map<string, { home: number | null; away: number | null; qualifier: string | null }>>(new Map())
  const [justSavedIds, setJustSavedIds] = useState<Set<string>>(new Set())
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const dirtyMatchIds = useRef<Set<string>>(new Set())
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    const newPredictions = new Map<string, { home: number | null; away: number | null; qualifier: string | null }>()
    const initialSaved = new Set<string>()
    displayedMatches.forEach((m) => {
      newPredictions.set(m.id, {
        home: m.myHomePrediction ?? null,
        away: m.myAwayPrediction ?? null,
        qualifier: m.myQualifierPrediction ?? null,
      })
      // Si le match a déjà un prono en DB, il est marqué comme "saved"
      if (m.myHomePrediction !== null && m.myAwayPrediction !== null) {
        initialSaved.add(m.id)
      }
    })
    setPredictions(newPredictions)
    setSavedIds(initialSaved)
  }, [displayedMatches])

  const performSave = async (matchId: string) => {
    const pred = predictions.get(matchId)
    if (!pred) return

    const result = await savePrediction(matchId, pred.home, pred.away, pred.qualifier)

    if (result.ok) {
      dirtyMatchIds.current.delete(matchId)
      // Marque comme sauvegardé de façon permanente
      setSavedIds((prev) => new Set(prev).add(matchId))
      // Flash temporaire (gradient un peu plus intense pendant 1.8s)
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
const handleResetPrediction = (matchId: string) => {
    // Retire immédiatement le marqueur "saved" (cache le gradient)
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.delete(matchId)
      return next
    })
    setJustSavedIds((prev) => {
      const next = new Set(prev)
      next.delete(matchId)
      return next
    })

    // Reset les prédictions
    setPredictions((prev) => {
      const next = new Map(prev)
      next.set(matchId, { home: null, away: null, qualifier: null })
      return next
    })

    // Cancel debounce existant et déclenche la suppression DB
    const existing = debounceTimers.current.get(matchId)
    if (existing) clearTimeout(existing)
    debounceTimers.current.delete(matchId)
    dirtyMatchIds.current.delete(matchId)

    // Suppression directe en DB (sans passer par performSave qui regarderait
    // un state pas encore mis à jour)
    savePrediction(matchId, null, null, null).catch((err) => {
      console.error("Reset failed:", err)
    })
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

  // ============================================
  // STATS + ANIMATIONS
  // ============================================
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const stats = useMemo(() => {
    const total = displayedMatches.length
    let predictionsMade = 0
    predictions.forEach((p) => {
      if (p.home !== null && p.away !== null) predictionsMade++
    })
    return { total, predictionsMade }
  }, [predictions, displayedMatches])

  useEffect(() => {
    const header = headerRef.current
    const tabs = tabsRef.current
    const content = contentRef.current
    if (!header || !tabs || !content) return

    const elements = [header, tabs, ...content.children]
    gsap.set(elements, { opacity: 0, y: 24 })
    gsap.to(elements, {
      opacity: 1, y: 0,
      duration: 0.5, stagger: 0.06,
      ease: "power3.out", delay: 0.1,
    })
  }, [mainTab, selectedGroup])

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-matches">
      <div className="w-full mx-auto">

        <header ref={headerRef} className="mb-8 ">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            Pronostics
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 ">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                {mainTab === "POULES" ? (
                  <>Phase de <span className="text-accent">poules</span></>
                ) : (
                  <>Phase <span className="text-accent">finale</span></>
                )}
              </h1>
              <p className="text-text-secondary mt-1">
                {mainTab === "POULES"
                  ? "Compose tes pronos avant le coup d'envoi"
                  : "Le bracket complet de la phase éliminatoire"}
              </p>
            </div>

            {mainTab === "POULES" && (
              <div className="flex items-center gap-6 ">
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
              </div>
            )}
          </div>
        </header>

        <div ref={tabsRef} className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMainTab("POULES")}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${mainTab === "POULES"
                ? "bg-accent text-bg"
                : "bg-white/[0.03] border border-white/10 text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
              }
            `}
          >
            Phase de poules
          </button>
          <button
            type="button"
            onClick={() => setMainTab("FINALE")}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${mainTab === "FINALE"
                ? "bg-accent text-bg"
                : "bg-white/[0.03] border border-white/10 text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
              }
            `}
          >
            Phase finale
          </button>
        </div>

        {mainTab === "POULES" && (
          <div className="mb-8 -mx-4 md:mx-0">
            <div className="flex gap-2 overflow-x-auto pb-2 px-4 md:px-0 scrollbar-hide">
              {fakeGroupLetters.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedGroup(letter)}
                  className={`
                    shrink-0 w-9 h-9 rounded-md text-xs font-bold transition-all
                    ${selectedGroup === letter
                      ? "bg-white/10 text-text-primary border border-white/20"
                      : "bg-white/[0.02] border border-white/5 text-text-muted hover:bg-white/[0.06] hover:text-text-secondary"
                    }
                  `}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={contentRef}>
          {mainTab === "POULES" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-[1400px] mx-auto">
              {displayedMatches.length === 0 ? (
                <div className="col-span-full rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-12 text-center text-text-muted">
                  Aucun match disponible pour ce groupe
                </div>
              ) : (
                displayedMatches.map((match) => {
                  const prediction = predictions.get(match.id) ?? { home: null, away: null, qualifier: null }
                  // isSaved = le prono actuel est identique à celui chargé depuis la DB (donc synchronisé)
                  // OU il a été "justSaved" (juste sauvegardé)
                    const isSaved = savedIds.has(match.id) && !dirtyMatchIds.current.has(match.id)

                  return (
                    <MatchCard
                      key={match.id}
                      match={match}
                      homePrediction={prediction.home}
                      awayPrediction={prediction.away}
                      qualifierPrediction={prediction.qualifier}
                      stageStatus="current"
                      onPredictionChange={handlePredictionChange}
                      onLeaveCard={handleLeaveCard}
                      onReset={handleResetPrediction}
                      justSaved={justSavedIds.has(match.id)}
                      isSaved={isSaved}
                    />
                  )



                  return (
                    <MatchCard
                      key={match.id}
                      match={match}
                      homePrediction={prediction.home}
                      awayPrediction={prediction.away}
                      qualifierPrediction={prediction.qualifier}
                      stageStatus="current"
                      onPredictionChange={handlePredictionChange}
                      onLeaveCard={handleLeaveCard}
                      justSaved={justSavedIds.has(match.id)}
                    />
                  )
                })
              )}
            </div>
                    ) : (
            <KnockoutBracket
              matches={matches}
              predictions={predictions}
              onPredictionChange={handlePredictionChange}
              onLeaveCard={handleLeaveCard}
              onReset={handleResetPrediction}
              justSavedIds={justSavedIds}
              savedIds={savedIds}
            />
          )}
        </div>

      </div>
    </div>
  )
}