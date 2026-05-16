"use client"

import { type FakeMatchDetailed } from "@/lib/fake-data/matches"
import { Star } from "@phosphor-icons/react"

type CompactMatchCardProps = {
  match: FakeMatchDetailed
  homePrediction: number | null
  awayPrediction: number | null
  qualifierPrediction: string | null
  justSaved?: boolean
  isSaved?: boolean
  onClick: () => void
}

export function CompactMatchCard({
  match,
  homePrediction,
  awayPrediction,
  qualifierPrediction,
  justSaved = false,
  isSaved = false,
  onClick,
}: CompactMatchCardProps) {
  const teamsKnown = match.homeTeam !== null && match.awayTeam !== null
  const hasPrediction = homePrediction !== null && awayPrediction !== null
  const isDrawPrediction = hasPrediction && homePrediction === awayPrediction
  const isKO = match.stage !== "GROUP"
  const isMissingQualifier =
    isKO && hasPrediction && isDrawPrediction && qualifierPrediction === null

  // Affiche le qualifier sur l'équipe correspondante (étoile)
  const homeHasStar = qualifierPrediction === match.homeTeam?.tla
  const awayHasStar = qualifierPrediction === match.awayTeam?.tla

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!teamsKnown}
      className={`
        relative w-full rounded-xl border backdrop-blur-xl overflow-hidden transition-all text-left 
        ${isMissingQualifier
          ? "bg-orange-500/[0.06] border-orange-500/40"
          : "bg-white border-white/10"
        }
        ${teamsKnown
          ? "cursor-pointer hover:bg-white/[0.06] hover:border-white/20"
          : "opacity-50 cursor-not-allowed"
        }
      `}
    >
      {/* Gradient vert si sauvegardé */}
      {(isSaved || justSaved) && (
        <div
          className={`
            pointer-events-none absolute bottom-0 left-0 right-0 h-16
            bg-gradient-to-t from-green-500/30 via-green-500/10 to-transparent
            transition-opacity duration-500
            ${justSaved ? "opacity-100" : "opacity-70"}
          `}
        />
      )}

      <div className="relative p-2.5 space-y-1.5">
        {/* Date */}
        <p className="text-[9px] uppercase tracking-widest text-text-muted truncate">
          {match.kickoffDate.split(" ")[0]} {match.kickoffDate.split(" ")[1]}
        </p>

        {/* Équipes */}
        {teamsKnown ? (
          <>
            {/* Home */}
            <div className="flex items-center gap-1.5">
              {match.homeTeam?.crest ? (
                <img
                  src={match.homeTeam.crest}
                  alt={match.homeTeam.tla}
                  className="w-4 h-4 object-contain shrink-0"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-white/10 shrink-0" />
              )}
              <span className="text-xs font-bold text-text-primary truncate flex-1">
                {match.homeTeam?.tla}
              </span>
              {homeHasStar && <Star size={10} weight="fill" className="text-accent" />}
              <span className={`
                text-xs font-bold tabular-nums w-4 text-right shrink-0
                ${hasPrediction ? "text-text-primary" : "text-text-muted"}
              `}>
                {hasPrediction ? homePrediction : "–"}
              </span>
            </div>

            {/* Away */}
            <div className="flex items-center gap-1.5">
              {match.awayTeam?.crest ? (
                <img
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.tla}
                  className="w-4 h-4 object-contain shrink-0"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-white/10 shrink-0" />
              )}
              <span className="text-xs font-bold text-text-primary truncate flex-1">
                {match.awayTeam?.tla}
              </span>
              {awayHasStar && <Star size={10} weight="fill" className="text-accent" />}
              <span className={`
                text-xs font-bold tabular-nums w-4 text-right shrink-0
                ${hasPrediction ? "text-text-primary" : "text-text-muted"}
              `}>
                {hasPrediction ? awayPrediction : "–"}
              </span>
            </div>
          </>
        ) : (
          <p className="text-[10px] text-text-muted text-center py-2">
            À déterminer
          </p>
        )}
      </div>
    </button>
  )
}