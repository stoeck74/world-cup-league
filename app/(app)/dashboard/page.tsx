import { auth } from "@/../auth"
import { ArrowRight, TrendUp, Trophy } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { DashboardChart } from "@/components/dashboard/DashboardChart"
import { PositionPop } from "@/components/dashboard/PositionPop"
import { getUserGoldenBootPredictions, getGoldenBootStatus } from "@/lib/actions/golden-boot"
import { GoldenBootCard } from "@/components/dashboard/GoldenBootCard"
import { HeroProgressBar } from "@/components/dashboard/HeroProgressBar"
import { SuccessRateCard } from "@/components/dashboard/SuccessRateCard"
import { ExactScoresCard } from "@/components/dashboard/ExactScoresCard"
import { buildAvatarUrl } from "@/lib/avatar"




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
  goldenBootStatus,
  goldenBootPredictions,
] = await Promise.all([
  getCurrentStage(userId),
  getUserStats(userId),
  getUserPosition(userId),
  getUpcomingMatches(4, userId),
  getLeaderboardTop(userId, 5),
  getMyLastResults(userId, 5),
  getPointsLastStage(userId),
  getChartData(userId),
  getGoldenBootStatus(),
  getUserGoldenBootPredictions(session.user.username),
])
  return (
    <div className="relative bg-dashboard h-full p-4 md:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-full mx-auto">

        {/* Halos décoratifs */}
        <div className="absolute top-0 right-0 w-325 h-250 bg-accent/25 rounded-full blur-[300px] pointer-events-none -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-375 h-250 bg-accent/25 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 relative mt-6">

{/* HERO CARD — Phase en cours + 3 prochains matchs */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-white/3 border border-white/10 backdrop-blur-sm p-8 flex flex-col justify-between gap-6">
            <div className="absolute -bottom-1/3 right-0 w-full h-1/2 bg-accent/30 rounded-full blur-3xl pointer-events-none" />

            {/* TITRE */}
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-accent mb-3 flex items-center gap-2">
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
                          ? "bg-accent/10 border-accent/20"
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
                          <span className="text-sm font-bold text-white tabular-nums">
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

 {/* FOOTER — Progress bar + bouton */}
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:gap-6 gap-4">
              <div className="flex-1">
                <HeroProgressBar
                  predictionsMade={currentStage.predictionsMade}
                  matchesCount={currentStage.matchesCount}
                />
              </div>
              <Link
                href="/matchs"
                className="inline-flex items-center justify-center gap-2 bg-accent text-neutral-200 px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 hover:text-neutral-50 transition-colors group shrink-0"
              >
                Pronostiquer
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

 {/* CARD POSITION — minimaliste */}
<div className="lg:col-span-4 relative overflow-hidden rounded-2xl bg-linear-to-br from-accent to-accent/80 border border-accent/50 backdrop-blur-sm p-6 md:p-8 flex flex-col">


  {/* Halos décoratifs */}
  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300/70 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-700/80 rounded-full blur-3xl pointer-events-none" />

  <p className="relative text-xs uppercase tracking-widest text-neutral-900 mb-4">
    Ma position
  </p>
  <div className="relative flex-1 min-h-50">
    <PositionPop
      position={position.position}
      totalPlayers={position.totalPlayers}
    />
  </div>
</div>

 </div>

{/* Ligne 2 — Réussite + Exacts + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 relative items-stretch">

          <div className="lg:col-span-3 h-full">
                        

            <SuccessRateCard
              goodResults={stats.goodResults}
              totalFinished={stats.finishedPredictions}
            />
          </div>

          <div className="lg:col-span-3 h-full">
            <ExactScoresCard
              exactScores={stats.exactScores}
              totalFinished={stats.finishedPredictions}
            />
          </div>

          <div className="lg:col-span-6 min-w-0 h-full">
            <DashboardChart data={chartData} />
          </div>

        </div>

        {/* Ligne 3 — Matchs à venir + Top + Derniers résultats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 relative">
          <div className="lg:col-span-3">
          <GoldenBootCard
 initialPicks={
            goldenBootPredictions.ok && goldenBootPredictions.predictions
              ? {
                  first: goldenBootPredictions.predictions.first,
                  second: goldenBootPredictions.predictions.second,
                  third: goldenBootPredictions.predictions.third,
                }
              : { first: null, second: null, third: null }
          
          }
          isLocked={goldenBootStatus.ok ? goldenBootStatus.locked : false}
        />
        </div>



          {/* TOP CLASSEMENT */}
          <div className=" lg:col-span-4 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-sm p-6 md:p-8 overflow-hidden">

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
                className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
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
                        : "hover:bg-white/2"
                      }
                    `}
                  >
                    <span className={`
                      text-sm font-bold w-6 shrink-0
                      ${player.isMe ? "text-aceent" : "text-text-muted"}
                    `}>
                      {player.position}.
                    </span>
                    <img
                      src={buildAvatarUrl(player.avatarStyle, player.avatarSeed, player.username)}
                      alt={player.username}
                      className="w-8 h-8 rounded-full bg-accent/30 border border-white/10 shrink-0"
                    />

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
          <div className="lg:col-span-5 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-xl p-6 md:p-8 relative">
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