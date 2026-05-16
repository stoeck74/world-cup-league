"use server"

import { auth } from "@/../auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ============================================
// HELPER : vérifie si le tournoi est encore "ouvert"
// pour modifier les pronos Soulier d'Or
// (= aucun match en cours ou terminé)
// ============================================

async function isGoldenBootLocked(): Promise<boolean> {
  const startedMatches = await prisma.match.count({
    where: {
status: { in: ["LIVE", "FINISHED"] },
    },
  })
  return startedMatches > 0
}

// ============================================
// SAUVEGARDE DES 3 PRONOS
// ============================================

export async function saveGoldenBootPredictions(
  player1Id: string | null,
  player2Id: string | null,
  player3Id: string | null
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "Non authentifié" }
  }

  // Vérifie le verrou : si le tournoi a commencé, refuse
  if (await isGoldenBootLocked()) {
    return { ok: false, error: "Le tournoi a commencé, plus possible de modifier" }
  }

  // Vérifie qu'il n'y a pas de doublons (impossible d'avoir le même joueur 2 fois)
  const ids = [player1Id, player2Id, player3Id].filter(Boolean)
  const uniqueIds = new Set(ids)
  if (uniqueIds.size !== ids.length) {
    return { ok: false, error: "Tu ne peux pas choisir 2 fois le même joueur" }
  }

  // Vérifie que les joueurs existent en DB
  if (ids.length > 0) {
    const playersFound = await prisma.player.count({
      where: { id: { in: ids as string[] } },
    })
    if (playersFound !== ids.length) {
      return { ok: false, error: "Un ou plusieurs joueurs sont introuvables" }
    }
  }

  // Sauvegarde
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      goldenBoot1stPlayerId: player1Id,
      goldenBoot2ndPlayerId: player2Id,
      goldenBoot3rdPlayerId: player3Id,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath(`/joueurs/${session.user.username}`)

  return { ok: true }
}

// ============================================
// RECHERCHE DE JOUEURS (pour autocomplete)
// ============================================

export async function searchPlayers(query: string) {
  if (!query || query.trim().length < 2) {
    return { ok: true, players: [] }
  }

  const players = await prisma.player.findMany({
    where: {
      name: {
        contains: query.trim(),
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      position: true,
      nationality: true,
      team: {
        select: {
          name: true,
          tla: true,
          crestUrl: true,
        },
      },
    },
    orderBy: [
      // Les attaquants d'abord (Soulier d'Or = quasi toujours un attaquant)
      { position: "asc" },
      { name: "asc" },
    ],
    take: 20,
  })

  return { ok: true, players }
}

// ============================================
// STATUS : verrouillé ou modifiable ?
// ============================================

export async function getGoldenBootStatus() {
  const locked = await isGoldenBootLocked()

  if (!locked) {
    return { ok: true, locked: false }
  }

  // Si verrouillé, on peut donner la date du 1er match commencé pour info
  const firstStartedMatch = await prisma.match.findFirst({
    where: {
status: { in: ["LIVE", "FINISHED"] },
    },
    orderBy: { kickoffAt: "asc" },
    select: { kickoffAt: true },
  })

  return {
    ok: true,
    locked: true,
    lockedSince: firstStartedMatch?.kickoffAt,
  }
}

// ============================================
// RÉCUPÈRE LES PRONOS D'UN USER (par username, pour profil public)
// ============================================

export async function getUserGoldenBootPredictions(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      goldenBoot1stPlayer: {
        select: {
          id: true,
          name: true,
          position: true,
          nationality: true,
          team: { select: { name: true, tla: true, crestUrl: true } },
        },
      },
      goldenBoot2ndPlayer: {
        select: {
          id: true,
          name: true,
          position: true,
          nationality: true,
          team: { select: { name: true, tla: true, crestUrl: true } },
        },
      },
      goldenBoot3rdPlayer: {
        select: {
          id: true,
          name: true,
          position: true,
          nationality: true,
          team: { select: { name: true, tla: true, crestUrl: true } },
        },
      },
    },
  })

  if (!user) {
    return { ok: false, error: "User introuvable" }
  }

  return {
    ok: true,
    predictions: {
      first: user.goldenBoot1stPlayer,
      second: user.goldenBoot2ndPlayer,
      third: user.goldenBoot3rdPlayer,
    },
  }
}