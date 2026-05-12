import { auth } from "@/../auth"
import {
  fakeUser,
  fakeCurrentStage,
  fakeUpcomingMatches,
  fakeLeaderboardTop,
  fakeLastResults,
} from "@/lib/fake-data/dashboard"
import { ArrowRight, TrendUp, Trophy } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { DashboardChart } from "@/components/dashboard/DashboardChart"

// ============================================
// DASHBOARD — Coupe du Monde 2026
// ============================================
// Différences clés vs Panenka League / Ligue 1 :
//  - "Prochaine journée" devient "Phase en cours" (poules / 1/16e / etc.)
//  - Pas de banco
//  - Le DashboardChart hérité de Ligue 1 reste à adapter en V2
//    (actuellement il garde les 38 journées en placeholder, à remplacer par
//     une visualisation phase de poules + KO)
// ============================================

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

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
            {fakeCurrentStage.label} · {fakeCurrentStage.startDate}
          </p>
        </header>

        {/* Ligne 1 — Hero (phase actuelle) + Position */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 relative">

          {/* HERO CARD — Phase en cours */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 min-h-[260px] flex flex-col justify-between">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-accent mb-3 flex items-center gap-2">
                <Trophy size={14} weight="fill" />
                Phase en cours
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-text-primary leading-tight mb-2">
                {fakeCurrentStage.label}
              </h2>
              <p className="text-text-secondary text-lg">
                {fakeCurrentStage.startDate} · coup d&apos;envoi {fakeCurrentStage.startTime}
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6">
              <div>
                <p className="text-xs text-text-muted mb-1">Pronostics</p>
                <p className="text-2xl font-bold text-text-primary">
                  {fakeCurrentStage.predictionsMade}
                  <span className="text-text-muted text-lg font-normal">
                    {" / "}{fakeCurrentStage.matchesCount} matchs
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
              <div className="flex items-baseline ">
                <span className="text-[7vw] font-black text-primary leading-none">
                  {fakeUser.position}
                </span>
                <span className="text-6xl text-primary font-bold">e</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                sur {fakeUser.totalPlayers} joueurs
              </p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-secondary mb-1">Total points</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {fakeUser.totalPoints}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-text-accent text-sm font-semibold">
                  <TrendUp size={16} weight="bold" />
                  +{fakeUser.pointsLastStage}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Ligne 2 — Graph + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 relative">

          {/* GRAPH (à adapter en V2 pour la CDM) */}
          <div className="lg:col-span-6 min-w-0">
            <DashboardChart />
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
                  {fakeUser.totalPoints}
                </p>
              </div>

              <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Réussite
                </p>
                <p className="text-3xl font-black text-accent">
                  {fakeUser.successRate}<span className="text-xl">%</span>
                </p>
              </div>

              <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Scores exacts
                </p>
                <p className="text-3xl font-black text-text-primary">
                  {fakeUser.exactScores}
                </p>
              </div>

              <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Bons résultats
                </p>
                <p className="text-3xl font-black text-text-primary">
                  {fakeUser.goodResults}
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
              {fakeUpcomingMatches.slice(0, 4).map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted shrink-0 w-10">
                      {match.homeTeamTla}
                    </span>
                    <span className="text-sm font-medium text-text-primary truncate">
                      {match.homeTeamName}
                    </span>
                  </div>

                  <div className="px-2 text-xs text-text-muted">vs</div>

                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="text-sm font-medium text-text-primary truncate text-right">
                      {match.awayTeamName}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted shrink-0 w-10 text-right">
                      {match.awayTeamTla}
                    </span>
                  </div>

                  <div className="ml-3 text-xs text-text-muted text-right shrink-0 hidden sm:block">
                    <p>{match.kickoffDate.split(" ")[0]}</p>
                    <p className="text-text-secondary font-medium">{match.kickoffTime}</p>
                  </div>
                </div>
              ))}
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
              {fakeLeaderboardTop.map((player) => (
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
              ))}
            </div>
          </div>

          {/* DERNIERS RÉSULTATS */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                  {fakeCurrentStage.label}
                </p>
                <h3 className="text-xl font-bold text-text-primary">
                  Mes derniers résultats
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Cette phase</p>
                <p className="text-xl font-bold text-accent">
                  +{fakeUser.pointsLastStage}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {fakeLastResults.map((result, idx) => (
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
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
