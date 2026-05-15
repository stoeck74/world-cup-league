import { auth } from "@/../auth"
import { ArrowRight, TrendUp, Trophy } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { DashboardChart } from "@/components/dashboard/DashboardChart"
import { PositionPop } from "@/components/dashboard/PositionPop"

import {
  getCurrentStage,
  getUserStats,
  getUserPosition,
  getUpcomingMatches,
  getLeaderboardTop,
  getMyLastResults,
  getPointsLastStage,
  getChartData,
} from "@/lib/dashboard-data"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const userId = session.user.id

  // Charge toutes les données en parallèle (plus rapide)
const [
    currentStage,
    stats,
    position,
    upcomingMatches,
    leaderboardTop,
    lastResults,
    pointsLastStage,
    chartData,
  ] = await Promise.all([
    getCurrentStage(userId),
    getUserStats(userId),
    getUserPosition(userId),
    getUpcomingMatches(4, userId),
    getLeaderboardTop(userId, 5),
    getMyLastResults(userId, 5),
    getPointsLastStage(userId),
    getChartData(userId),
  ])
  return (
    <div className="relative bg-dashboard h-full p-4 md:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        {/* Halos décoratifs */}
        <div className="absolute top-0 left-0 w-[800px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[1500px] h-[700px] bg-accent/25 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

        {/* Header */}
        <header className="mb-8 relative">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            Tableau de bord
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Bonjour <span className="text-accent">{session.user.username}</span>
          </h1>
          <p className="text-text-secondary mt-1">
            {currentStage.label}
            {currentStage.startDate && ` · ${currentStage.startDate}`}
          </p>
        </header>

        {/* Ligne 1 — Hero (phase actuelle) + Position */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 relative">

{/* HERO CARD — Phase en cours + 3 prochains matchs */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 flex flex-col justify-between gap-6">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            {/* TITRE */}
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-accent mb-3 flex items-center gap-2">
                <Trophy size={14} weight="fill" />
                Phase en cours
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-text-primary leading-tight mb-2">
                {currentStage.label}
              </h2>
              {currentStage.startDate && (
                <p className="text-text-secondary text-lg">
                  {currentStage.startDate} · coup d&apos;envoi {currentStage.startTime}
                </p>
              )}
            </div>

{/* 3 PROCHAINS MATCHS */}
            {upcomingMatches.length > 0 && (
              <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
                {upcomingMatches.slice(0, 3).map((match) => {
                  const hasPrediction =
                    match.myHomePrediction !== null && match.myAwayPrediction !== null
                  return (
                    <div
                      key={match.id}
                      className={`
                        rounded-xl border p-4 transition-colors
                        ${hasPrediction
                          ? "bg-accent/10 border-accent/30"
                          : "bg-black/30 border-white/10"
                        }
                      `}
                    >
                      <p className="text-[10px] uppercase tracking-widest text-text-muted mb-3">
                        {match.kickoffDate} · {match.kickoffTime}
                      </p>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-sm font-bold text-text-primary truncate">
                          {match.homeTeamTla}
                        </span>
                        <span className="text-xs text-text-muted">vs</span>
                        <span className="text-sm font-bold text-text-primary truncate">
                          {match.awayTeamTla}
                        </span>
                      </div>

                      {/* Prono */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-text-muted">
                          Mon prono
                        </span>
                        {hasPrediction ? (
                          <span className="text-sm font-bold text-accent tabular-nums">
                            {match.myHomePrediction} - {match.myAwayPrediction}
                          </span>
                        ) : (
                          <span className="text-xs text-text-muted italic">
                            À faire
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* FOOTER — Pronostics + bouton */}
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Pronostics</p>
                <p className="text-2xl font-bold text-text-primary">
                  {currentStage.predictionsMade}
                  <span className="text-text-muted text-lg font-normal">
                    {" / "}{currentStage.matchesCount} matchs
                  </span>
                </p>
              </div>
              <Link
                href="/matchs"
                className="inline-flex items-center justify-center gap-2 bg-accent text-bg px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors group"
              >
                Pronostiquer
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* CARD POSITION */}
          <div className="lg:col-span-4 rounded-2xl bg-accent border border-accent/10 backdrop-blur-xl p-8 flex flex-col justify-between min-h-[260px]">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-accent mb-3">
                Ma position
              </p>
<PositionPop
              position={position.position}
              totalPlayers={position.totalPlayers}
              points={position.points}
              gapToLeader={position.gapToLeader}
              isLeader={position.isLeader}
              pointsLastStage={pointsLastStage}
              predictionsMade={currentStage.predictionsMade}
              totalMatches={currentStage.matchesCount}
            />
              <p className="text-sm text-text-secondary mt-2">
                sur {position.totalPlayers} joueur{position.totalPlayers > 1 ? "s" : ""}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-secondary mb-1">Total points</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {position.points}
                  </p>
                </div>
                {pointsLastStage > 0 && (
                  <div className="flex items-center gap-1.5 text-text-accent text-sm font-semibold">
                    <TrendUp size={16} weight="bold" />
                    +{pointsLastStage}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Ligne 2 — Graph + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 relative">

          {/* GRAPH (à adapter en V2 pour la CDM) */}
          <div className="lg:col-span-6 min-w-0">
            <DashboardChart data={chartData} />
          </div>

          {/* MES STATS */}
          <div className="lg:col-span-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                Mondial 2026
              </p>
              <h3 className="text-xl font-bold text-text-primary">
                Mes statistiques
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Total points
                </p>
                <p className="text-3xl font-black text-text-primary">
                  {stats.totalPoints}
                </p>
              </div>

              <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Réussite
                </p>
                <p className="text-3xl font-black text-accent">
                  {stats.successRate}<span className="text-xl">%</span>
                </p>
              </div>

              <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Scores exacts
                </p>
                <p className="text-3xl font-black text-text-primary">
                  {stats.exactScores}
                </p>
              </div>

              <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Bons résultats
                </p>
                <p className="text-3xl font-black text-text-primary">
                  {stats.goodResults}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Ligne 3 — Matchs à venir + Top + Derniers résultats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 relative">

          {/* MATCHS À PRONOSTIQUER */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                  À venir
                </p>
                <h3 className="text-xl font-bold text-text-primary">
                  Matchs à pronostiquer
                </h3>
              </div>
              <Link
                href="/matchs"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                Voir tout
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingMatches.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">
                  Aucun match à venir
                </p>
              ) : (
                upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-center py-3 border-b border-white/5 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">

                      <span className="text-sm font-medium text-text-primary truncate">
                        {match.homeTeamName}
                      </span>
                    </div>

                    <div className="px-2 text-xs text-text-muted">vs</div>

                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="text-sm font-medium text-text-primary truncate text-right">
                        {match.awayTeamName}
                      </span>

                    </div>

                    <div className="ml-3 text-xs text-text-muted text-right shrink-0 hidden sm:block">
                      <p>{match.kickoffDate.split(" ")[0]}</p>
                      <p className="text-text-secondary font-medium">{match.kickoffTime}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TOP CLASSEMENT */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                  Classement
                </p>
                <h3 className="text-xl font-bold text-text-primary">
                  Top de la League
                </h3>
              </div>
              <Link
                href="/classement"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                Voir tout
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

            <div className="space-y-2">
              {leaderboardTop.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">
                  Aucun joueur encore
                </p>
              ) : (
                leaderboardTop.map((player) => (
                  <div
                    key={player.position}
                    className={`
                      flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors
                      ${player.isMe
                        ? "bg-accent/10 border border-accent/20"
                        : "hover:bg-white/[0.02]"
                      }
                    `}
                  >
                    <span className={`
                      text-sm font-bold w-6 shrink-0
                      ${player.isMe ? "text-accent" : "text-text-muted"}
                    `}>
                      {player.position}.
                    </span>

                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold uppercase text-text-secondary">
                        {player.username[0]}
                      </span>
                    </div>

                    <span className={`
                      flex-1 text-sm font-medium truncate
                      ${player.isMe ? "text-text-primary" : "text-text-secondary"}
                    `}>
                      {player.username}
                      {player.isMe && (
                        <span className="text-accent ml-2 text-xs">●</span>
                      )}
                    </span>

                    <span className={`
                      text-sm font-bold shrink-0
                      ${player.isMe ? "text-accent" : "text-text-primary"}
                    `}>
                      {player.points}
                      <span className="text-text-muted text-xs font-normal ml-1">pts</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DERNIERS RÉSULTATS */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                  {currentStage.label}
                </p>
                <h3 className="text-xl font-bold text-text-primary">
                  Mes derniers résultats
                </h3>
              </div>
              {pointsLastStage > 0 && (
                <div className="text-right">
                  <p className="text-xs text-text-muted">Récent</p>
                  <p className="text-xl font-bold text-accent">
                    +{pointsLastStage}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {lastResults.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">
                  Aucun résultat pour l&apos;instant
                </p>
              ) : (
                lastResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 py-3 border-b border-white/5 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-bold uppercase text-text-muted shrink-0 w-10">
                        {result.homeTeamTla}
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {result.homeScore}
                      </span>
                      <span className="text-text-muted">-</span>
                      <span className="text-sm font-medium text-text-primary">
                        {result.awayScore}
                      </span>
                      <span className="text-xs font-bold uppercase text-text-muted shrink-0 w-10">
                        {result.awayTeamTla}
                      </span>
                    </div>

                    <div className="text-xs text-text-muted">
                      prono <span className="text-text-secondary font-medium">{result.myHomePrediction}-{result.myAwayPrediction}</span>
                    </div>

                    <div className={`
                      text-sm font-bold w-12 text-right shrink-0
                      ${result.myPoints > 0 ? "text-accent" : "text-text-muted"}
                    `}>
                      {result.myPoints > 0 ? `+${result.myPoints}` : "0"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}