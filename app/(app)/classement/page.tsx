import { auth } from "@/../auth"
import { LeaderboardChart, type LeaderboardEntry } from "@/components/leaderboard/LeaderboardChart"
import { getLeaderboard } from "@/lib/dashboard-data"

export default async function ClassementPage() {
  const session = await auth()
  if (!session) return null

  const leaderboard = await getLeaderboard()

  // Map vers le type attendu par le composant
  const entries: LeaderboardEntry[] = leaderboard.map((e) => ({
    position: e.position,
    username: e.username,
    avatarStyle: e.avatarStyle ?? undefined,
    avatarSeed: e.avatarSeed ?? undefined,
    points: e.points,
    isMe: e.id === session.user.id,
    predictionsMade: e.predictionsMade,
    exactScores: e.exactScores,
  }))

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-ranking min-h-screen">
      <div className="max-w-[1400px] mx-auto">

        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            World Cup League
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Classement de la <span className="text-accent">League</span>
          </h1>
          <p className="text-text-secondary mt-1">
            {entries.length} joueur{entries.length > 1 ? "s" : ""} · Coupe du Monde 2026
          </p>
        </header>

        {/* Si pas encore 3 joueurs, on affiche un message */}
        {entries.length === 0 ? (
          <div className="mt-16 md:mt-36 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-12 text-center">
            <p className="text-text-secondary">
              Aucun joueur n&apos;a encore rejoint la League.
            </p>
          </div>
        ) : (
          <div className="mt-16 md:mt-36">
            <LeaderboardChart entries={entries} />
          </div>
        )}

      </div>
    </div>
  )
}