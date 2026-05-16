import * as dotenv from "dotenv"
import * as path from "path"
dotenv.config({ path: path.resolve(__dirname, "../.env") })

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env")
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const API_BASE = "https://api.football-data.org/v4"

// ============================================
// TYPES API
// ============================================

type ApiPlayer = {
  id: number
  name: string
  position: string | null
  dateOfBirth: string | null
  nationality: string | null
}

type ApiTeamDetail = {
  id: number
  name: string
  squad: ApiPlayer[]
}

// ============================================
// HELPERS
// ============================================

async function fetchTeamDetail(teamExternalId: number): Promise<ApiTeamDetail> {
  const token = process.env.FOOTBALL_DATA_API_KEY
  if (!token) {
    throw new Error("FOOTBALL_DATA_API_KEY is not defined in .env")
  }

  const response = await fetch(`${API_BASE}/teams/${teamExternalId}`, {
    headers: { "X-Auth-Token": token },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Pause entre les calls pour respecter le rate limit (10 calls/min = 1 toutes les 6s)
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🌍 Sync joueurs CDM 2026 — démarrage")

  // Récupère toutes les équipes du tournoi depuis la DB
  const teams = await prisma.team.findMany({
    select: { id: true, name: true, externalId: true },
  })

  console.log(`📋 ${teams.length} équipes à traiter`)
  console.log("⏳ Rate limit 10 calls/min → ~6 sec entre chaque équipe\n")

  let totalPlayersImported = 0
  let totalGoalkeepersSkipped = 0
  let teamsProcessed = 0

  for (const team of teams) {
    teamsProcessed++
    console.log(`[${teamsProcessed}/${teams.length}] ${team.name} (id API ${team.externalId})`)

    try {
      const apiTeam = await fetchTeamDetail(team.externalId)

      if (!apiTeam.squad || apiTeam.squad.length === 0) {
        console.log(`  ⚠️  Pas de squad disponible`)
        await sleep(6500)
        continue
      }

      let playersInTeam = 0
      let goalkeepersInTeam = 0

      for (const apiPlayer of apiTeam.squad) {
        // Skip les gardiens
        if (apiPlayer.position === "Goalkeeper") {
          goalkeepersInTeam++
          continue
        }

        await prisma.player.upsert({
          where: { externalId: apiPlayer.id },
          create: {
            externalId: apiPlayer.id,
            name: apiPlayer.name,
            position: apiPlayer.position,
            dateOfBirth: apiPlayer.dateOfBirth ? new Date(apiPlayer.dateOfBirth) : null,
            nationality: apiPlayer.nationality,
            teamId: team.id,
          },
          update: {
            name: apiPlayer.name,
            position: apiPlayer.position,
            dateOfBirth: apiPlayer.dateOfBirth ? new Date(apiPlayer.dateOfBirth) : null,
            nationality: apiPlayer.nationality,
            teamId: team.id,
          },
        })

        playersInTeam++
      }

      totalPlayersImported += playersInTeam
      totalGoalkeepersSkipped += goalkeepersInTeam
      console.log(`  ✓ ${playersInTeam} joueurs importés, ${goalkeepersInTeam} gardiens skippés`)

    } catch (error) {
      console.error(`  ❌ Erreur :`, error instanceof Error ? error.message : error)
    }

    // Rate limit : ~6.5s entre chaque équipe pour rester sous 10 calls/min
    if (teamsProcessed < teams.length) {
      await sleep(6500)
    }
  }

  console.log("\n========================================")
  console.log(`✓ ${totalPlayersImported} joueurs importés`)
  console.log(`✓ ${totalGoalkeepersSkipped} gardiens skippés`)
  console.log("========================================")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })