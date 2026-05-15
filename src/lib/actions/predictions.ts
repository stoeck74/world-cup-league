"use server"

import { auth } from "@/../auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Sauvegarde ou met à jour un prono pour un match donné.
 *
 * @param matchId - ID du match (en DB)
 * @param homeScore - Score domicile (null = supprime le prono)
 * @param awayScore - Score extérieur
 * @param qualifierTla - TLA de l'équipe qui passe (KO uniquement, null sinon)
 */
export async function savePrediction(
  matchId: string,
  homeScore: number | null,
  awayScore: number | null,
  qualifierTla: string | null
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "Non authentifié" }
  }

  // Si les 2 scores sont null → on supprime le prono
  if (homeScore === null || awayScore === null) {
    try {
      await prisma.prediction.deleteMany({
        where: {
          userId: session.user.id,
          matchId,
        },
      })
      return { ok: true, deleted: true }
    } catch (e) {
      console.error("Failed to delete prediction:", e)
      return { ok: false, error: "Erreur lors de la suppression" }
    }
  }

  // Vérifier que le match existe et n'est pas commencé
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { status: true, kickoffAt: true, stage: true },
  })

  if (!match) {
    return { ok: false, error: "Match introuvable" }
  }
  if (match.status !== "SCHEDULED") {
    return { ok: false, error: "Match déjà commencé ou terminé" }
  }
  if (match.kickoffAt < new Date()) {
    return { ok: false, error: "Trop tard, le match a déjà débuté" }
  }

  // Résoudre le qualifierTla → qualifierTeamId
  let qualifierTeamId: string | null = null
  if (qualifierTla) {
    const team = await prisma.team.findFirst({
      where: { tla: qualifierTla },
      select: { id: true },
    })
    qualifierTeamId = team?.id ?? null
  }

  // Upsert le prono
  try {
    await prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId: session.user.id,
          matchId,
        },
      },
      create: {
        userId: session.user.id,
        matchId,
        homeScore,
        awayScore,
        qualifierTeamId,
      },
      update: {
        homeScore,
        awayScore,
        qualifierTeamId,
      },
    })

    return { ok: true }
  } catch (e) {
    console.error("Failed to save prediction:", e)
    return { ok: false, error: "Erreur lors de l'enregistrement" }
  }
}