"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { gsap } from "gsap"
import { TreeStructure } from "@phosphor-icons/react"
import { MatchCard } from "./MatchCard"
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

export function MatchsView({ matches, stages, currentStage }: MatchsViewProps) {
  const [selectedStage, setSelectedStage] = useState<FakeStage>(currentStage)
  const [selectedGroup, setSelectedGroup] = useState<string>("A")

  const selectedStageInfo = stages.find((s) => s.key === selectedStage)
  
  // ON RÉCUPÈRE LE STATUS ICI (past, current, ou future)
  const stageStatus = selectedStageInfo?.status ?? "future"
  
  const isGroupStage = selectedStage === "GROUP"

  // Filtrage des matchs
  const displayedMatches = useMemo(() => {
    if (isGroupStage) {
      return matches.filter(m => m.stage === "GROUP" && m.group === selectedGroup)
    }
    return matches.filter(m => m.stage === selectedStage)
  }, [selectedStage, selectedGroup, matches, isGroupStage])

  // État des prédictions local
  const [predictions, setPredictions] = useState<Map<string, { home: number | null, away: number | null }>>(new Map())

  // Animation GSAP
  const cardsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      )
    }
  }, [selectedStage, selectedGroup])

  return (
    <div className="bg-matches min-h-screen p-4 md:p-6 lg:p-8 text-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-accent">{selectedStageInfo?.label}</span>
            {isGroupStage && <span className="text-white/40 ml-4 font-light">Groupe {selectedGroup}</span>}
          </h1>
        </header>

        {/* NAVIGATION DES PHASES */}
        <nav className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {stages.map((s) => (
            <button
              key={s.key}
              onClick={() => setSelectedStage(s.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedStage === s.key ? "bg-accent text-black" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* NAVIGATION DES GROUPES */}
        {isGroupStage && (
          <div className="flex gap-2 overflow-x-auto pb-6 mb-6 border-b border-white/5 scrollbar-hide">
            {fakeGroupLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedGroup(letter)}
                className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full border transition-all ${
                  selectedGroup === letter 
                    ? "border-accent text-accent bg-accent/10" 
                    : "border-white/10 text-white/40 hover:border-white/30"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        {/* LISTE DES MATCHS */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.length > 0 ? (
            displayedMatches.map((m) => {
              const prediction = predictions.get(m.id) || { home: null, away: null };
              return (
                <MatchCard 
                  key={m.id} 
                  match={m} 
                  homePrediction={prediction.home}
                  awayPrediction={prediction.away}
                  stageStatus={stageStatus} // LA PROP MANQUANTE EST ICI MAINTENANT
                  onPredictionChange={(matchId, home, away) => {
                    const next = new Map(predictions);
                    next.set(matchId, { home, away });
                    setPredictions(next);
                  }}
                />
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <TreeStructure size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-white/40">Les matchs de cette phase ne sont pas encore déterminés.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}