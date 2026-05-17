"use client"

import { Lock, Star, X } from "@phosphor-icons/react"

import { ScoreInput } from "./ScoreInput"
import type { FakeMatchDetailed } from "@/lib/fake-data/matches"

type StageStatus = "past" | "current" | "future"

type MatchCardProps = {
  match: FakeMatchDetailed
  homePrediction: number | null
  awayPrediction: number | null
  qualifierPrediction: string | null
  stageStatus: StageStatus
  onPredictionChange: (
    matchId: string,
    home: number | null,
    away: number | null,
    qualifier: string | null
  ) => void
  onLeaveCard?: (matchId: string) => void
  onReset?: (matchId: string) => void
  justSaved?: boolean
  isSaved?: boolean
}

export function MatchCard({
  match,
  homePrediction,
  awayPrediction,
  qualifierPrediction,
  stageStatus,
  onPredictionChange,
  onLeaveCard,
  onReset,
  justSaved = false,
  isSaved = false,
}: MatchCardProps) {
  const handleHomeChange = (value: number | null) => {
    // Si on touche home et que away est null, on initialise away à 0 pour avoir un prono cohérent
    const safeAway = awayPrediction ?? (value !== null ? 0 : null)
    onPredictionChange(match.id, value, safeAway, qualifierPrediction)
  }

  const handleAwayChange = (value: number | null) => {
    // Idem inverse : si on touche away, on init home à 0 si null
    const safeHome = homePrediction ?? (value !== null ? 0 : null)
    onPredictionChange(match.id, safeHome, value, qualifierPrediction)
  }

  const handleQualifierClick = (tla: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Toggle : si on reclique sur la même équipe, on désélectionne
    const newQualifier = qualifierPrediction === tla ? null : tla
    onPredictionChange(match.id, homePrediction, awayPrediction, newQualifier)
  }

  const isReadOnly = stageStatus !== "current" || match.status !== "scheduled"
  const isFinished = match.status === "finished"
  const teamsKnown = match.homeTeam !== null && match.awayTeam !== null

  // État pristine : aucun prono engagé
  const isPristine = homePrediction === null && awayPrediction === null

  // Match KO avec score nul engagé → nécessite une étoile
  const isKnockout = match.stage !== "GROUP"
  const isDrawPrediction =
    homePrediction !== null &&
    awayPrediction !== null &&
    homePrediction === awayPrediction
  const showStars = isKnockout && isDrawPrediction && teamsKnown
  const isMissingQualifier = showStars && qualifierPrediction === null

  const handleCardClick = () => {
    if (isReadOnly || !teamsKnown || !isPristine) return
    onPredictionChange(match.id, 0, 0, null)
  }

  return (
    <div
      onClick={handleCardClick}
      onMouseLeave={() => onLeaveCard?.(match.id)}
      className={`
        relative rounded-2xl border backdrop-blur-sm overflow-hidden transition-all
        ${isMissingQualifier
          ? "bg-orange-500/[0.06] border-orange-500/40"
          : "bg-white/[0.03] border-white/10"
        }
        ${isPristine && !isReadOnly && teamsKnown
          ? "cursor-pointer hover:bg-white/[0.05] hover:border-white/20"
          : ""
        }
      `}
    >
       {/* Gradient vert en bas — permanent si sauvé, flash au moment du save */}
      {(isSaved || justSaved) && (
        <div
          className={`
            pointer-events-none absolute bottom-0 left-0 right-0 h-48
            bg-gradient-to-t from-blue-500/33 to-transparent
        
            transition-opacity duration-500
            ${justSaved ? "opacity-100" : "opacity-70"}
          `}
        />
      )}
       {/* Bouton reset — visible si engagé (au moins 1 score non null) */}
      {!isPristine && !isReadOnly && onReset && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onReset(match.id)
          }}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          title="Annuler ce prono"
          aria-label="Annuler ce prono"
        >
          <X size={12} weight="bold" />
        </button>
      )}

      <div className="relative p-5 md:p-6">

        {/* Header */}
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

          {stageStatus === "future" && (
            <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center">
              <Lock size={14} weight="regular" className="text-text-muted" />
            </div>
          )}
        </div>

        {/* Équipes pas encore connues */}
        {!teamsKnown ? (
          <>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <p className="text-sm font-medium text-text-secondary italic">
                {match.homePlaceholder ?? "Équipe à déterminer"}
              </p>
            </div>
            <div className="flex items-center justify-between py-3">
              <p className="text-sm font-medium text-text-secondary italic">
                {match.awayPlaceholder ?? "Équipe à déterminer"}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
              <p className="text-xs text-text-muted/60">
                Pronostic disponible une fois les qualifiés connus
              </p>
            </div>
          </>
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
                {/* Étoile domicile */}
                {showStars && (
                  <button
                    type="button"
                    onClick={(e) => handleQualifierClick(match.homeTeam!.tla, e)}
                    disabled={isReadOnly}
                    className="flex items-center justify-center transition-all hover:scale-110"
                    aria-label={`${match.homeTeam!.shortName} se qualifie`}
                  >
                    <Star
                      size={20}
                      weight={qualifierPrediction === match.homeTeam!.tla ? "fill" : "regular"}
                      className={
                        qualifierPrediction === match.homeTeam!.tla
                          ? "text-accent"
                          : "text-text-muted hover:text-text-secondary"
                      }
                    />
                  </button>
                )}

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
                {/* Étoile extérieur */}
                {showStars && (
                  <button
                    type="button"
                    onClick={(e) => handleQualifierClick(match.awayTeam!.tla, e)}
                    disabled={isReadOnly}
                    className="flex items-center justify-center transition-all hover:scale-110"
                    aria-label={`${match.awayTeam!.shortName} se qualifie`}
                  >
                    <Star
                      size={20}
                      weight={qualifierPrediction === match.awayTeam!.tla ? "fill" : "regular"}
                      className={
                        qualifierPrediction === match.awayTeam!.tla
                          ? "text-accent"
                          : "text-text-muted hover:text-text-secondary"
                      }
                    />
                  </button>
                )}

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

            {/* Indicateur pristine */}
            {isPristine && !isReadOnly && (
              <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-text-muted/80">
                  Clique sur la carte pour pronostiquer
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer points */}
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