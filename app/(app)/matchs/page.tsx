// app/(app)/matchs/page.tsx
import { auth } from "@/../auth"
import { prisma } from "@/lib/prisma"
import { fakeStages, type FakeMatchDetailed, type FakeStage } from "@/lib/fake-data/matches"
import { MatchsView } from "@/components/matches/MatchsView"
import { redirect } from "next/navigation"

export default async function MatchsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // ============================================
  // CHARGE LES MATCHS DEPUIS LA DB
  // ============================================
  const dbMatches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { kickoffAt: "asc" },
  })

  // ============================================
  // CHARGE LES PRONOS DE L'UTILISATEUR
  // ============================================
  const myPredictions = await prisma.prediction.findMany({
    where: { userId: session.user.id },
    include: {
      qualifierTeam: true,
    },
  })

  // Map des prédictions par matchId pour lookup rapide
  const predictionByMatchId = new Map(
    myPredictions.map((p) => [p.matchId, p])
  )

  // ============================================
  // MAPPING DB → FakeMatchDetailed (pour réutiliser les composants)
  // ============================================
  const matches: FakeMatchDetailed[] = dbMatches.map((m) => {
    const myPrediction = predictionByMatchId.get(m.id)

    // Format date français : "Jeudi 11 juin"
    const kickoffDate = m.kickoffAt.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    // Capitalise la première lettre (jeudi → Jeudi)
    const formattedDate = kickoffDate.charAt(0).toUpperCase() + kickoffDate.slice(1)

    // Format heure : "21:00"
    const kickoffTime = m.kickoffAt.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris",
    })

    return {
      id: m.id,
      stage: m.stage as FakeStage,
      group: m.group ?? undefined,
      homeTeam: m.homeTeam
        ? {
            name: m.homeTeam.name,
            shortName: m.homeTeam.shortName,
            tla: m.homeTeam.tla,
            crest: m.homeTeam.crestUrl ?? "",
          }
        : null,
      awayTeam: m.awayTeam
        ? {
            name: m.awayTeam.name,
            shortName: m.awayTeam.shortName,
            tla: m.awayTeam.tla,
            crest: m.awayTeam.crestUrl ?? "",
          }
        : null,
      kickoffDate: formattedDate,
      kickoffTime,
      status:
        m.status === "FINISHED"
          ? "finished"
          : m.status === "LIVE"
          ? "live"
          : "scheduled",
      homeScore: m.homeScore ?? undefined,
      awayScore: m.awayScore ?? undefined,
      myHomePrediction: myPrediction?.homeScore ?? null,
      myAwayPrediction: myPrediction?.awayScore ?? null,
      myQualifierPrediction: myPrediction?.qualifierTeam?.tla ?? null,
      myPoints: myPrediction?.pointsEarned ?? undefined,
    }
  })

  return (
    <MatchsView
      matches={matches}
      stages={fakeStages}
      currentStage="GROUP"
    />
  )
}