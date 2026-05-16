"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { CompactMatchCard } from "./CompactMatchCard"
import { MatchPredictionModal } from "./MatchPredictionModal"
import { type FakeMatchDetailed } from "@/lib/fake-data/matches"

type PredictionEntry = {
  home: number | null
  away: number | null
  qualifier: string | null
}

type KnockoutBracketProps = {
  matches: FakeMatchDetailed[]
  predictions: Map<string, PredictionEntry>
  onPredictionChange: (
    matchId: string,
    home: number | null,
    away: number | null,
    qualifier: string | null
  ) => void
  onLeaveCard: (matchId: string) => void
  onReset: (matchId: string) => void
  justSavedIds: Set<string>
  savedIds: Set<string>
}

type SubTab = "R32" | "BRACKET"

export function KnockoutBracket({
  matches,
  predictions,
  onPredictionChange,
  onLeaveCard,
  onReset,
  justSavedIds,
  savedIds,
}: KnockoutBracketProps) {
  const [subTab, setSubTab] = useState<SubTab>("R32")
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filtre par stage
  const round32 = matches.filter((m) => m.stage === "ROUND_32")
  const round16 = matches.filter((m) => m.stage === "ROUND_16")
  const quarters = matches.filter((m) => m.stage === "QUARTER")
  const semis = matches.filter((m) => m.stage === "SEMI")
  const thirdPlace = matches.filter((m) => m.stage === "THIRD_PLACE")
  const finals = matches.filter((m) => m.stage === "FINAL")

  // Animation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cards = container.querySelectorAll("[data-bracket-card]")
    gsap.set(cards, { opacity: 0, y: 16 })
    gsap.to(cards, {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.015,
      ease: "power3.out", delay: 0.1,
    })
  }, [subTab])

  const selectedMatch = selectedMatchId
    ? matches.find((m) => m.id === selectedMatchId) ?? null
    : null

  const renderCard = (match: FakeMatchDetailed) => {
    const pred = predictions.get(match.id) ?? { home: null, away: null, qualifier: null }
    return (
      <div key={match.id} data-bracket-card>
        <CompactMatchCard
          match={match}
          homePrediction={pred.home}
          awayPrediction={pred.away}
          qualifierPrediction={pred.qualifier}
          justSaved={justSavedIds.has(match.id)}
          isSaved={savedIds.has(match.id)}
          onClick={() => setSelectedMatchId(match.id)}
        />
      </div>
    )
  }

  return (
    <>
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
          Phase finale
        </button>
      </div>

      <div ref={containerRef}>

        {/* ============================================
            1/16e — Grid 4 cols
            ============================================ */}
        {subTab === "R32" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {round32.map(renderCard)}
          </div>
        )}

        {/* ============================================
            BRACKET
            Mobile (<md) : sections empilées
            Desktop (md+) : bracket symétrique 6 cols
            ============================================ */}
        {subTab === "BRACKET" && (
          <>
            {/* ========== MOBILE : sections empilées ========== */}
            <div className="md:hidden space-y-8">

              {/* 1/8e */}
              <section>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-3">
                  1/8e de finale · {round16.length} matchs
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {round16.map(renderCard)}
                </div>
              </section>

              {/* Quarts */}
              <section>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-3">
                  Quarts de finale · {quarters.length} matchs
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {quarters.map(renderCard)}
                </div>
              </section>

              {/* Demis */}
              <section>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-3">
                  Demi-finales · {semis.length} matchs
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {semis.map(renderCard)}
                </div>
              </section>

              {/* Finale */}
              <section>
                <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3 text-center">
                  Finale
                </p>
                <div className="max-w-xs mx-auto">
                  {finals.map(renderCard)}
                </div>
              </section>

              {/* 3e place */}
              {thirdPlace.length > 0 && (
                <section>
                  <p className="text-xs uppercase tracking-widest text-text-muted mb-3 text-center">
                    3e place
                  </p>
                  <div className="max-w-xs mx-auto">
                    {thirdPlace.map(renderCard)}
                  </div>
                </section>
              )}

            </div>

{/* ========== DESKTOP : bracket symétrique 6 cols ========== */}
            <div className="hidden md:block">

              {/* Header colonnes */}
              <div className="grid grid-cols-6 gap-3 mb-3">
                <p className="text-[10px] uppercase tracking-widest text-text-muted text-center">1/8e</p>
                <p className="text-[10px] uppercase tracking-widest text-text-muted text-center">Quarts</p>
                <p className="col-span-2 text-[10px] uppercase tracking-widest text-text-muted text-center">Demi · Finale</p>
                <p className="text-[10px] uppercase tracking-widest text-text-muted text-center">Quarts</p>
                <p className="text-[10px] uppercase tracking-widest text-text-muted text-center">1/8e</p>
              </div>

              <div
                className="grid grid-cols-6 gap-3"
                style={{ minHeight: "calc(100vh - 380px)" }}
              >
                {/* Col 1 : 1/8e GAUCHE — 4 cards en 4 zones égales */}
                <div className="flex flex-col">
                  {round16.slice(0, 4).map((m) => (
                    <div key={m.id} className="flex-1 flex items-center">
                      <div className="w-full">{renderCard(m)}</div>
                    </div>
                  ))}
                </div>
 {/* Col 2 : 1/4 GAUCHE — col divisée en 2 (50% chacune),
                    quart centré verticalement dans sa moitié */}
                <div className="flex flex-col h-full">
                  <div className="h-1/2 flex items-center">
                    <div className="w-full">
                      {quarters.slice(0, 1).map(renderCard)}
                    </div>
                  </div>
                  <div className="h-1/2 flex items-center">
                    <div className="w-full">
                      {quarters.slice(1, 2).map(renderCard)}
                    </div>
                  </div>
                </div>

{/* Col 3+4 : Zone centrale.
                    Les demis sont alignées sur les quarts (au milieu vertical).
                    La finale et la 3e place dépassent dessous. */}
                <div className="col-span-2 flex flex-col h-full">

                  {/* Demis : positionnées au milieu vertical (50%)
                      Le wrapper h-1/2 + items-end pousse les demis au bord bas
                      = donc leur centre est à 50% */}
                   <div className="h-1/2 flex items-end">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {semis.slice(0, 1).map(renderCard)}
                      {semis.slice(1, 2).map(renderCard)}
                    </div>
                  </div>

                  {/* Finale + 3e place : dans la moitié basse, alignées en haut */}
                  <div className="h-1/2 flex flex-col items-center pt-4 gap-3">

                    {/* Finale w-2/3 centrée */}
                    <div className="w-2/3 flex flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-accent text-center">
                        Finale
                      </p>
                      {finals.map(renderCard)}
                    </div>

                    {/* 3e place w-2/3 centrée */}
                    {thirdPlace.length > 0 && (
                      <div className="w-2/3 flex flex-col gap-2">
                        <p className="text-[10px] uppercase tracking-widest text-text-muted text-center">
                          3e place
                        </p>
                        {thirdPlace.map(renderCard)}
                      </div>
                    )}

                  </div>

                </div>
                {/* Col 5 : 1/4 DROITE — col divisée en 2 (50% chacune),
                    quart centré verticalement dans sa moitié */}
                <div className="flex flex-col h-full">
                  <div className="h-1/2 flex items-center">
                    <div className="w-full">
                      {quarters.slice(2, 3).map(renderCard)}
                    </div>
                  </div>
                  <div className="h-1/2 flex items-center">
                    <div className="w-full">
                      {quarters.slice(3, 4).map(renderCard)}
                    </div>
                  </div>
                </div>

                {/* Col 6 : 1/8e DROITE — 4 cards en 4 zones égales */}
                <div className="flex flex-col">
                  {round16.slice(4, 8).map((m) => (
                    <div key={m.id} className="flex-1 flex items-center">
                      <div className="w-full">{renderCard(m)}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

      </div>

      {/* MODAL */}
           {selectedMatch && (
        <MatchPredictionModal
          match={selectedMatch}
          homePrediction={predictions.get(selectedMatch.id)?.home ?? null}
          awayPrediction={predictions.get(selectedMatch.id)?.away ?? null}
          qualifierPrediction={predictions.get(selectedMatch.id)?.qualifier ?? null}
          justSaved={justSavedIds.has(selectedMatch.id)}
          isSaved={savedIds.has(selectedMatch.id)}
          onPredictionChange={onPredictionChange}
          onLeaveCard={onLeaveCard}
          onReset={onReset}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </>
  )
}