"use client"

import { Lock } from "@phosphor-icons/react"
import { ScoreInput } from "./ScoreInput"
import type { FakeMatchDetailed } from "@/lib/fake-data/matches"

type StageStatus = "past" | "current" | "future"

type MatchCardProps = {
  match: FakeMatchDetailed
  homePrediction: number | null
  awayPrediction: number | null
  stageStatus: StageStatus
  onPredictionChange: (matchId: string, home: number | null, away: number | null) => void
}

// ============================================
// MATCH CARD — Coupe du Monde 2026
//
// Différences vs Panenka League / Ligue 1 :
//  - Pas de banco
//  - Les équipes peuvent être null (KO sans qualifiés connus)
//  - Affichage du groupe (A → L) si phase de poules
//  - À VENIR : champ "qui passe ?" pour les KO (à coder en V2 avec qualifierPrediction)
// ============================================

export function MatchCard({
  match,
  homePrediction,
  awayPrediction,
  stageStatus,
  onPredictionChange,
}: MatchCardProps) {
  const handleHomeChange = (value: number) => {
    onPredictionChange(match.id, value, awayPrediction)
  }

  const handleAwayChange = (value: number) => {
    onPredictionChange(match.id, homePrediction, value)
  }

  // Lecture seule si phase passée/future, ou si match commencé
  const isReadOnly = stageStatus !== "current" || match.status !== "scheduled"
  const isFinished = match.status === "finished"

  // Si les équipes ne sont pas connues (KO en attente de qualif), on affiche un placeholder
  const teamsKnown = match.homeTeam !== null && match.awayTeam !== null

  return (
    <div className="relative rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden">

      <div className="relative p-5 md:p-6">

        {/* Header : date + groupe (si poules) + lock (si future) */}
        <div className="flex items-center justify-between mb-5 h-8">
          <div className="flex items-center gap-3">
            <p className="text-xs uppercase tracking-widest text-text-muted">
              {match.kickoffDate} · {match.kickoffTime}
            </p>
            {match.group && (
              <span className="text-xs uppercase tracking-widest font-bold text-accent">
                Groupe {match.group}
              </span>
            )}
          </div>

          {/* Indicateur lecture seule pour phases futures */}
          {stageStatus === "future" && (
            <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center">
              <Lock size={14} weight="regular" className="text-text-muted" />
            </div>
          )}
        </div>

        {/* Si équipes pas encore connues (KO en attente) */}
        {!teamsKnown ? (
          <div className="py-8 text-center">
            <p className="text-sm text-text-muted italic">
              Équipes à déterminer
            </p>
            <p className="text-xs text-text-muted/60 mt-1">
              Disponible une fois les qualifiés connus
            </p>
          </div>
        ) : (
          <>
            {/* Équipe domicile */}
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {match.homeTeam!.crest && (
                  <img
                    src={match.homeTeam!.crest}
                    alt={match.homeTeam!.shortName}
                    className="w-8 h-8 object-contain shrink-0"
                  />
                )}
                <span className="text-base font-semibold text-text-primary truncate">
                  <span className="hidden md:inline">{match.homeTeam!.shortName}</span>
                  <span className="md:hidden">{match.homeTeam!.tla}</span>
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                {isFinished && match.homeScore !== undefined && (
                  <span className="text-3xl md:text-4xl font-black leading-none tabular-nums text-text-primary">
                    {match.homeScore}
                  </span>
                )}
                <ScoreInput
                  value={homePrediction}
                  onChange={handleHomeChange}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Équipe extérieur */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {match.awayTeam!.crest && (
                  <img
                    src={match.awayTeam!.crest}
                    alt={match.awayTeam!.shortName}
                    className="w-8 h-8 object-contain shrink-0"
                  />
                )}
                <span className="text-base font-semibold text-text-primary truncate">
                  <span className="hidden md:inline">{match.awayTeam!.shortName}</span>
                  <span className="md:hidden">{match.awayTeam!.tla}</span>
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                {isFinished && match.awayScore !== undefined && (
                  <span className="text-3xl md:text-4xl font-black leading-none tabular-nums text-text-primary">
                    {match.awayScore}
                  </span>
                )}
                <ScoreInput
                  value={awayPrediction}
                  onChange={handleAwayChange}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </>
        )}

        {/* Footer points gagnés (matchs terminés) */}
        {isFinished && match.myPoints !== undefined && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-text-muted">
              {homePrediction !== null && awayPrediction !== null
                ? "Mon prono"
                : "Pas de prono"}
            </p>
            <p
              className={`text-sm font-bold ${match.myPoints > 0 ? "text-accent" : "text-text-muted"}`}
            >
              {match.myPoints > 0 ? `+${match.myPoints}` : "0"} pts
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
