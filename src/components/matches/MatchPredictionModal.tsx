"use client"

import { useEffect } from "react"
import { X } from "@phosphor-icons/react"
import { MatchCard } from "./MatchCard"
import { type FakeMatchDetailed } from "@/lib/fake-data/matches"

type MatchPredictionModalProps = {
  match: FakeMatchDetailed | null
  homePrediction: number | null
  awayPrediction: number | null
  qualifierPrediction: string | null
  justSaved?: boolean
  isSaved?: boolean
  onPredictionChange: (
    matchId: string,
    home: number | null,
    away: number | null,
    qualifier: string | null
  ) => void
  onLeaveCard: (matchId: string) => void
  onClose: () => void
  onReset?: (matchId: string) => void
}

export function MatchPredictionModal({
  match,
  homePrediction,
  awayPrediction,
  qualifierPrediction,
  justSaved,
  isSaved,
  onPredictionChange,
  onLeaveCard,
  onClose,
  onReset,
}: MatchPredictionModalProps) {
  // ESC pour fermer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  if (!match) return null

  // Sauvegarde à la fermeture
  const handleClose = () => {
    onLeaveCard(match.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-12 right-0 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Fermer"
        >
          <X size={24} weight="bold" />
        </button>

        {/* MatchCard complète */}
        <MatchCard
          match={match}
          homePrediction={homePrediction}
          awayPrediction={awayPrediction}
          qualifierPrediction={qualifierPrediction}
          stageStatus="current"
          onPredictionChange={onPredictionChange}
          onLeaveCard={onLeaveCard}
          onReset={onReset}
          justSaved={justSaved}
          isSaved={isSaved}
        />
      </div>
    </div>
  )
}