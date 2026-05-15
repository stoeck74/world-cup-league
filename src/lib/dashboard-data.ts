import { prisma } from "@/lib/prisma"

// ============================================
// CALCUL DES POINTS — Helpers réutilisables
// Sources de vérité pour tous les composants qui affichent
// du classement, des stats, etc.
// ============================================

/**
 * Récupère le classement complet de la League.
 * Trié par points (descendant).
 */
export async function getLeaderboard() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      username: true,
      avatarStyle: true,
      avatarSeed: true,
      predictions: {
        select: {
          pointsEarned: true,
          homeScore: true,
          awayScore: true,
          match: {
            select: {
              status: true,
              homeScore: true,
              awayScore: true,
            },
          },
        },
      },
    },
  })

  const leaderboard = users
    .map((user) => {
      const totalPoints = user.predictions.reduce(
        (sum, p) => sum + (p.pointsEarned ?? 0),
        0
      )
      const predictionsMade = user.predictions.length
      const exactScores = user.predictions.filter(
        (p) =>
          p.match.status === "FINISHED" &&
          p.homeScore === p.match.homeScore &&
          p.awayScore === p.match.awayScore
      ).length

      return {
        id: user.id,
        username: user.username,
        avatarStyle: user.avatarStyle,
        avatarSeed: user.avatarSeed,
        points: totalPoints,
        predictionsMade,
        exactScores,
      }
    })
    .sort((a, b) => b.points - a.points)
    .map((entry, idx) => ({ ...entry, position: idx + 1 }))

  return leaderboard
}

/**
 * Récupère les stats détaillées d'un user.
 */
export async function getUserStats(userId: string) {
  const predictions = await prisma.prediction.findMany({
    where: { userId },
    include: {
      match: {
        select: {
          status: true,
          homeScore: true,
          awayScore: true,
          stage: true,
        },
      },
    },
  })

  const totalPoints = predictions.reduce((sum, p) => sum + (p.pointsEarned ?? 0), 0)
  const finishedPredictions = predictions.filter((p) => p.match.status === "FINISHED")
  const exactScores = finishedPredictions.filter(
    (p) => p.homeScore === p.match.homeScore && p.awayScore === p.match.awayScore
  ).length
  const goodResults = finishedPredictions.filter((p) => (p.pointsEarned ?? 0) > 0).length
  const successRate =
    finishedPredictions.length > 0
      ? Math.round((goodResults / finishedPredictions.length) * 100)
      : 0

  return {
    totalPoints,
    predictionsMade: predictions.length,
    exactScores,
    goodResults,
    successRate,
  }
}

/**
 * Récupère la position d'un user dans le classement.
 */
export async function getUserPosition(userId: string) {
  const leaderboard = await getLeaderboard()
  const me = leaderboard.find((e) => e.id === userId)
  return {
    position: me?.position ?? leaderboard.length,
    totalPlayers: leaderboard.length,
    points: me?.points ?? 0,
  }
}

/**
 * Récupère les prochains matchs (non commencés) — pour la card "À pronostiquer".
 */
export async function getUpcomingMatches(limit = 4, userId?: string) {
  const matches = await prisma.match.findMany({
    where: {
      status: "SCHEDULED",
      kickoffAt: { gte: new Date() },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      predictions: userId
        ? {
            where: { userId },
            select: { homeScore: true, awayScore: true },
          }
        : false,
    },
    orderBy: { kickoffAt: "asc" },
    take: limit,
  })

  return matches.map((m) => {
    const myPrediction = userId && m.predictions?.[0] ? m.predictions[0] : null
    return {
      id: m.id,
      homeTeamName: m.homeTeam?.name ?? m.homeTeam?.shortName ?? "?",
      homeTeamTla: m.homeTeam?.tla ?? "?",
      awayTeamName: m.awayTeam?.name ?? m.awayTeam?.shortName ?? "?",
      awayTeamTla: m.awayTeam?.tla ?? "?",
      kickoffDate: m.kickoffAt.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      kickoffTime: m.kickoffAt.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      }),
      myHomePrediction: myPrediction?.homeScore ?? null,
      myAwayPrediction: myPrediction?.awayScore ?? null,
    }
  })
}

/**
 * Récupère les derniers résultats du user (matchs joués avec ses pronos).
 */
export async function getMyLastResults(userId: string, limit = 5) {
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
      match: { status: "FINISHED" },
    },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: {
      match: { kickoffAt: "desc" },
    },
    take: limit,
  })

  return predictions.map((p) => ({
    homeTeamTla: p.match.homeTeam?.tla ?? "?",
    awayTeamTla: p.match.awayTeam?.tla ?? "?",
    homeScore: p.match.homeScore ?? 0,
    awayScore: p.match.awayScore ?? 0,
    myHomePrediction: p.homeScore,
    myAwayPrediction: p.awayScore,
    myPoints: p.pointsEarned ?? 0,
  }))
}

/**
 * Info sur la phase en cours (ou prochaine).
 */
export async function getCurrentStage(userId: string) {
  // Trouve le prochain match SCHEDULED
  const nextMatch = await prisma.match.findFirst({
    where: { status: "SCHEDULED" },
    orderBy: { kickoffAt: "asc" },
    select: { stage: true, kickoffAt: true },
  })

  // Compte total matchs du tournoi
  const totalMatches = await prisma.match.count()

  // Compte les pronos du user
  const predictionsMade = await prisma.prediction.count({
    where: { userId },
  })

  if (!nextMatch) {
    return {
      label: "Tournoi terminé",
      startDate: "",
      startTime: "",
      predictionsMade,
      matchesCount: totalMatches,
    }
  }

  // Map stage → label
  const stageLabels: Record<string, string> = {
    GROUP: "Phase de poules",
    ROUND_32: "1/16e de finale",
    ROUND_16: "1/8e de finale",
    QUARTER: "Quarts de finale",
    SEMI: "Demi-finales",
    THIRD_PLACE: "Petite finale",
    FINAL: "Finale",
  }

  const stageLabel = stageLabels[nextMatch.stage] ?? "Tournoi"
  const startDate = nextMatch.kickoffAt.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  const formattedDate = startDate.charAt(0).toUpperCase() + startDate.slice(1)
  const startTime = nextMatch.kickoffAt.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  })

  // Compte les matchs de cette stage
  const stageMatchesCount = await prisma.match.count({
    where: { stage: nextMatch.stage },
  })

  return {
    label: stageLabel,
    startDate: formattedDate,
    startTime,
    predictionsMade,
    matchesCount: stageMatchesCount,
  }
}

/**
 * Top 5 du classement (pour le dashboard).
 */
export async function getLeaderboardTop(currentUserId: string, limit = 5) {
  const leaderboard = await getLeaderboard()
  return leaderboard.slice(0, limit).map((entry) => ({
    position: entry.position,
    username: entry.username,
    points: entry.points,
    isMe: entry.id === currentUserId,
  }))
}

/**
 * Points gagnés sur la phase actuelle (les matchs joués récemment).
 * Pour l'instant, on prend les 5 derniers matchs joués du user.
 */
export async function getPointsLastStage(userId: string) {
  const recentPredictions = await prisma.prediction.findMany({
    where: {
      userId,
      match: { status: "FINISHED" },
    },
    select: { pointsEarned: true },
    orderBy: {
      match: { kickoffAt: "desc" },
    },
    take: 10,
  })

  return recentPredictions.reduce((sum, p) => sum + (p.pointsEarned ?? 0), 0)
}

/**
 * Récupère l'évolution des points/position du user sur le tournoi.
 * Groupé par jour de match.
 */
export async function getChartData(userId: string) {
  // Tous les pronos du user sur des matchs joués, ordonnés par date
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
      match: { status: "FINISHED" },
    },
    include: {
      match: {
        select: {
          kickoffAt: true,
        },
      },
    },
    orderBy: {
      match: { kickoffAt: "asc" },
    },
  })

  if (predictions.length === 0) return []

  // Récupère le leaderboard pour pouvoir calculer la position à chaque date
  // (On le simplifie : on calculera juste les points + cumul, la position
  // nécessiterait une logique plus lourde qu'on peut faire en V2)
  const leaderboardSize = await prisma.user.count()

  // Group by date (YYYY-MM-DD)
  const byDate = new Map<string, { points: number; date: Date }>()
  predictions.forEach((p) => {
    const dateKey = p.match.kickoffAt.toISOString().slice(0, 10)
    const existing = byDate.get(dateKey)
    if (existing) {
      existing.points += p.pointsEarned ?? 0
    } else {
      byDate.set(dateKey, {
        points: p.pointsEarned ?? 0,
        date: p.match.kickoffAt,
      })
    }
  })

  // Convertit en array trié + calcul cumul
  const sorted = Array.from(byDate.entries())
    .sort(([, a], [, b]) => a.date.getTime() - b.date.getTime())

  let cumulative = 0
  return sorted.map(([dateKey, data], idx) => {
    cumulative += data.points
    const dayLabel = data.date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    })

    return {
      index: idx + 1,
      label: dayLabel,
      points: data.points,
      cumulative,
      // Position : on simplifie en mettant null pour l'instant
      // (calcul complexe nécessitant un snapshot à chaque date)
      position: leaderboardSize,
    }
  })
}

/**
 * Récupère tous les pronos passés d'un user (matchs FINISHED).
 * Pour l'affichage public dans la fiche profil.
 */
export async function getUserPastPredictions(userId: string) {
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
      match: { status: "FINISHED" },
    },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: {
      match: { kickoffAt: "desc" },
    },
  })

 return predictions.map((p) => {
    const isExact =
      p.homeScore === p.match.homeScore && p.awayScore === p.match.awayScore
    const points = p.pointsEarned ?? 0

    return {
      matchDate: p.match.kickoffAt,
      homeTeamTla: p.match.homeTeam?.tla ?? "?",
      homeTeamName: p.match.homeTeam?.shortName ?? "?",
      homeTeamCrest: p.match.homeTeam?.crestUrl ?? null,
      awayTeamTla: p.match.awayTeam?.tla ?? "?",
      awayTeamName: p.match.awayTeam?.shortName ?? "?",
      awayTeamCrest: p.match.awayTeam?.crestUrl ?? null,
      homeScore: p.match.homeScore ?? 0,
      awayScore: p.match.awayScore ?? 0,
      myHomePrediction: p.homeScore,
      myAwayPrediction: p.awayScore,
      points,
      result: isExact ? "exact" : points > 0 ? "good" : "missed",
    }
  })
}

/**
 * Récupère les pronos en cours d'un user (matchs SCHEDULED).
 * À utiliser uniquement sur son propre profil — les pronos en cours
 * sont privés tant que le match n'a pas eu lieu.
 */
export async function getUserUpcomingPredictions(userId: string) {
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
      match: { status: "SCHEDULED" },
    },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          qualifierTeam: true,
        },
      },
      qualifierTeam: true,
    },
    orderBy: {
      match: { kickoffAt: "asc" },
    },
  })

  return predictions.map((p) => ({
    matchDate: p.match.kickoffAt,
    homeTeamTla: p.match.homeTeam?.tla ?? "?",
    homeTeamName: p.match.homeTeam?.shortName ?? "?",
    homeTeamCrest: p.match.homeTeam?.crestUrl ?? null,
    awayTeamTla: p.match.awayTeam?.tla ?? "?",
    awayTeamName: p.match.awayTeam?.shortName ?? "?",
    awayTeamCrest: p.match.awayTeam?.crestUrl ?? null,
    myHomePrediction: p.homeScore,
    myAwayPrediction: p.awayScore,
    myQualifierTla: p.qualifierTeam?.tla ?? null,
    kickoffDate: p.match.kickoffAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    }),
    kickoffTime: p.match.kickoffAt.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris",
    }),
  }))
}