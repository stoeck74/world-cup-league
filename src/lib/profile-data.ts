/**
 * Stats agrégées pour la page profil d'un user.
 * - Position dans le classement
 * - Nombre de pronos faits
 * - Meilleure journée (matchday avec le plus de points cumulés)
 */
import { prisma } from "@/lib/prisma"
import { getLeaderboard } from "@/lib/dashboard-data"



export async function getProfileStats(userId: string) {
  // Position via le leaderboard
  const leaderboard = await getLeaderboard()
  const me = leaderboard.find((e) => e.id === userId)
  const position = me?.position ?? leaderboard.length
  const totalPlayers = leaderboard.length

  // Nombre total de pronos
  const predictionsMade = await prisma.prediction.count({
    where: { userId },
  })

// Meilleur jour : on groupe les points par date de match
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
      pointsEarned: { gt: 0 },
      match: { status: "FINISHED" },
    },
    select: {
      pointsEarned: true,
      match: { select: { kickoffAt: true } },
    },
  })

  const pointsByDay = new Map<string, number>()
  for (const p of predictions) {
    if (!p.match.kickoffAt) continue
    // On groupe par date (YYYY-MM-DD)
    const dayKey = p.match.kickoffAt.toISOString().split("T")[0]
    const current = pointsByDay.get(dayKey) ?? 0
    pointsByDay.set(dayKey, current + (p.pointsEarned ?? 0))
  }

  let bestScore = 0
  let bestDay: string | null = null
  for (const [day, points] of pointsByDay.entries()) {
    if (points > bestScore) {
      bestScore = points
      bestDay = day
    }
  }

  // Format date en français court (genre "12 juin")
  let bestDayLabel = ""
  if (bestDay) {
    const d = new Date(bestDay)
    bestDayLabel = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(d)
  }

  return {
    position,
    totalPlayers,
    predictionsMade,
    bestScore,
    bestDayLabel,
  }
}