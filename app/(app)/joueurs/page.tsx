import { auth } from "@/../auth"
import { prisma } from "@/lib/prisma"
import { PlayerCard } from "@/components/players/PlayerCard"

export default async function JoueursPage() {
  const session = await auth()
  if (!session) return null

  // Récupère tous les joueurs avec leur équipe favorite
  const players = await prisma.user.findMany({
    orderBy: { username: "asc" },
    select: {
      username: true,
      avatarStyle: true,
      avatarSeed: true,
      favoritePlayer: true,
      favoriteTeam: {
        select: {
          name: true,
          tla: true,
          crestUrl: true,
        },
      },
    },
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-players h-full">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            World Cup League
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Les <span className="text-accent">participants</span>
          </h1>
          <p className="text-text-secondary mt-1">
            {players.length} joueur{players.length > 1 ? "s" : ""} · Coupe du Monde 2026
          </p>
        </header>

        {/* Grid 4 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((player) => (
            <PlayerCard key={player.username} player={player} />
          ))}
        </div>

      </div>
    </div>
  )
}