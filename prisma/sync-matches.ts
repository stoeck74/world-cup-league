// ============================================
// SYNC SCRIPT — Pousse les équipes + matchs de la WC en DB
// Lancer avec : npx tsx prisma/sync-matches.ts
// ============================================

import * as dotenv from "dotenv"
import * as path from "path"
dotenv.config({ path: path.resolve(__dirname, "../.env") })

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import {
  fetchTeams,
  fetchMatches,
  mapMatchStage,
  mapMatchStatus,
  extractGroupLetter,
} from "../src/lib/football-data"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🏆 Sync World Cup 2026 → DB")
  console.log("──────────────────────────────────────")

  // ============================================
  // ÉTAPE 1 — Tournament
  // ============================================
  console.log("\n📅 Création/récupération du tournoi WC 2026...")

  const tournament = await prisma.tournament.upsert({
    where: { externalId: 2000 },
    create: {
      externalId: 2000,
      name: "FIFA World Cup 2026",
      startDate: new Date("2026-06-11"),
      endDate: new Date("2026-07-19"),
      isActive: true,
    },
    update: {
      isActive: true,
    },
  })
  console.log(`   ✓ Tournament: ${tournament.name} (id=${tournament.id})`)

  // ============================================
  // ÉTAPE 2 — Équipes (48 nations)
  // ============================================
  console.log("\n🌍 Récupération des équipes...")
  const apiTeams = await fetchTeams()
  console.log(`   API: ${apiTeams.length} équipes`)

  let teamsCreated = 0
  let teamsUpdated = 0

  for (const apiTeam of apiTeams) {
    const result = await prisma.team.upsert({
      where: { externalId: apiTeam.id },
      create: {
        externalId: apiTeam.id,
        name: apiTeam.name,
        shortName: apiTeam.shortName,
        tla: apiTeam.tla,
        crestUrl: apiTeam.crest,
      },
      update: {
        name: apiTeam.name,
        shortName: apiTeam.shortName,
        tla: apiTeam.tla,
        crestUrl: apiTeam.crest,
      },
    })
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      teamsCreated++
    } else {
      teamsUpdated++
    }
  }
  console.log(`   ✓ Créées: ${teamsCreated}, Mises à jour: ${teamsUpdated}`)

  // ============================================
  // ÉTAPE 3 — Matchs (104)
  // ============================================
  console.log("\n⚽ Récupération des matchs...")
  const apiMatches = await fetchMatches()
  console.log(`   API: ${apiMatches.length} matchs`)

  // Map externalId → id (DB) pour les équipes
  const allTeams = await prisma.team.findMany()
  const teamIdByExternalId = new Map(allTeams.map((t) => [t.externalId, t.id]))

  let matchesCreated = 0
  let matchesUpdated = 0

  for (const apiMatch of apiMatches) {
    const homeTeamDbId = apiMatch.homeTeam
      ? teamIdByExternalId.get(apiMatch.homeTeam.id) ?? null
      : null
    const awayTeamDbId = apiMatch.awayTeam
      ? teamIdByExternalId.get(apiMatch.awayTeam.id) ?? null
      : null

    const result = await prisma.match.upsert({
      where: { externalId: apiMatch.id },
      create: {
        externalId: apiMatch.id,
        tournamentId: tournament.id,
        stage: mapMatchStage(apiMatch.stage),
        group: extractGroupLetter(apiMatch.group),
        homeTeamId: homeTeamDbId,
        awayTeamId: awayTeamDbId,
        kickoffAt: new Date(apiMatch.utcDate),
        status: mapMatchStatus(apiMatch.status),
        homeScore: apiMatch.score.fullTime.home,
        awayScore: apiMatch.score.fullTime.away,
        homeExtraTime: apiMatch.score.extraTime?.home ?? null,
        awayExtraTime: apiMatch.score.extraTime?.away ?? null,
        homePenalties: apiMatch.score.penalties?.home ?? null,
        awayPenalties: apiMatch.score.penalties?.away ?? null,
      },
      update: {
        stage: mapMatchStage(apiMatch.stage),
        group: extractGroupLetter(apiMatch.group),
        homeTeamId: homeTeamDbId,
        awayTeamId: awayTeamDbId,
        kickoffAt: new Date(apiMatch.utcDate),
        status: mapMatchStatus(apiMatch.status),
        homeScore: apiMatch.score.fullTime.home,
        awayScore: apiMatch.score.fullTime.away,
        homeExtraTime: apiMatch.score.extraTime?.home ?? null,
        awayExtraTime: apiMatch.score.extraTime?.away ?? null,
        homePenalties: apiMatch.score.penalties?.home ?? null,
        awayPenalties: apiMatch.score.penalties?.away ?? null,
      },
    })
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      matchesCreated++
    } else {
      matchesUpdated++
    }
  }
  console.log(`   ✓ Créés: ${matchesCreated}, Mis à jour: ${matchesUpdated}`)

  console.log("\n✅ Sync terminé avec succès !")
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du sync :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })