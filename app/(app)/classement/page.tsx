import { auth } from "@/../auth"
import { LeaderboardChart, type LeaderboardEntry } from "@/components/leaderboard/LeaderboardChart"

// ============================================
// FAKE DATA — à remplacer par prisma.user.findMany() trié par points
// ============================================
const fakeLeaderboard: LeaderboardEntry[] = [
  {
    position: 1,
    username: "marco_pronos",
    avatarStyle: "toon-head",
    avatarSeed: "marco",
    points: 58,
    isMe: false,
    predictionsMade: 24,
    exactScores: 6,
  },
  {
    position: 2,
    username: "lucky_luke",
    avatarStyle: "personas",
    avatarSeed: "lucky",
    points: 52,
    isMe: false,
  },
  {
    position: 3,
    username: "admin",
    avatarStyle: "toon-head",
    avatarSeed: "admin",
    points: 47,
    isMe: true,
  },
  {
    position: 4,
    username: "thibault_om",
    avatarStyle: "personas",
    avatarSeed: "thibault",
    points: 43,
    isMe: false,
  },
  {
    position: 5,
    username: "fabrice_psg",
    avatarStyle: "toon-head",
    avatarSeed: "fabrice",
    points: 39,
    isMe: false,
  },
  {
    position: 6,
    username: "kevin_canard",
    avatarStyle: "personas",
    avatarSeed: "kevin",
    points: 31,
    isMe: false,
  },
  {
    position: 7,
    username: "sarah_om",
    avatarStyle: "toon-head",
    avatarSeed: "sarah",
    points: 28,
    isMe: false,
  },
  {
    position: 8,
    username: "totoche",
    avatarStyle: "personas",
    avatarSeed: "totoche",
    points: 22,
    isMe: false,
  },
]

export default async function ClassementPage() {
  const session = await auth()
  if (!session) return null

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-ranking min-h-screen bg-ranking">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            World Cup League
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Classement de la <span className="text-accent">League</span>
          </h1>
          <p className="text-text-secondary mt-1">
            {fakeLeaderboard.length} joueurs · Coupe du Monde 2026
          </p>
        </header>

{/* Leaderboard — centré verticalement avec marge généreuse */}
        <div className="mt-16 md:mt-36">
          <LeaderboardChart entries={fakeLeaderboard} />
        </div>

      </div>
    </div>
  )
}