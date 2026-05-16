import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


import {
  fetchTeams,
  fetchMatches,
  mapMatchStage,
  mapMatchStatus,
  extractGroupLetter,
} from "@/lib/football-data"
import { calculateAllPointsInternal } from "@/lib/actions/points"
import { translateTeamName } from "@/lib/team-translations"


// ============================================
// SYNC API → DB
// Endpoint appelé par un cron externe (cron-job.org)
// Sécurisé par un token dans le header "Authorization: Bearer XXX"
// ou en query param "?token=XXX"
// ============================================

export async function GET(request: NextRequest) {
  // Vérif token
  const expectedToken = process.env.CRON_SECRET
  if (!expectedToken) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 }
    )
  }

  // Token via header Authorization (recommandé) OU query param (fallback)
  const authHeader = request.headers.get("authorization")
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null
  const tokenFromQuery = request.nextUrl.searchParams.get("token")
  const providedToken = tokenFromHeader || tokenFromQuery

  if (providedToken !== expectedToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const startTime = Date.now()
  const log: string[] = []

  try {
    // ============================================
    // ÉTAPE 1 — Tournament
    // ============================================
    const tournament = await prisma.tournament.upsert({
      where: { externalId: 2000 },
      create: {
        externalId: 2000,
        name: "FIFA World Cup 2026",
        startDate: new Date("2026-06-11"),
        endDate: new Date("2026-07-19"),
        isActive: true,
      },
      update: { isActive: true },
    })
    log.push(`✓ Tournament: ${tournament.name}`)

    // ============================================
    // ÉTAPE 2 — Équipes
    // ============================================
    const apiTeams = await fetchTeams()
    let teamsUpserted = 0
for (const apiTeam of apiTeams) {
      const translatedName = translateTeamName(apiTeam.name)
      const translatedShortName = translateTeamName(apiTeam.shortName)

      await prisma.team.upsert({
        where: { externalId: apiTeam.id },
        create: {
          externalId: apiTeam.id,
          name: translatedName,
          shortName: translatedShortName,
          tla: apiTeam.tla,
          crestUrl: apiTeam.crest,
        },
        update: {
          name: translatedName,
          shortName: translatedShortName,
          tla: apiTeam.tla,
          crestUrl: apiTeam.crest,
        },
      })
      teamsUpserted++
    }
    log.push(`✓ ${teamsUpserted} équipes synchronisées`)

    // ============================================
    // ÉTAPE 3 — Matchs
    // ============================================
    const apiMatches = await fetchMatches()
    const allTeams = await prisma.team.findMany()
    const teamIdByExternalId = new Map(allTeams.map((t) => [t.externalId, t.id]))

// OPTIM : récupère tous les matchs existants en UNE seule query
    const existingMatches = await prisma.match.findMany({
      select: { externalId: true, status: true },
    })
    const statusByExternalId = new Map(
      existingMatches.map((m) => [m.externalId, m.status])
    )

    let matchesUpserted = 0
    let matchesNewlyFinished = 0
    for (const apiMatch of apiMatches) {
      const homeTeamDbId = apiMatch.homeTeam
        ? teamIdByExternalId.get(apiMatch.homeTeam.id) ?? null
        : null
      const awayTeamDbId = apiMatch.awayTeam
        ? teamIdByExternalId.get(apiMatch.awayTeam.id) ?? null
        : null

      const newStatus = mapMatchStatus(apiMatch.status)

      // Détecte les matchs qui viennent de passer en FINISHED (sans query DB)
      const previousStatus = statusByExternalId.get(apiMatch.id)
      if (previousStatus && previousStatus !== "FINISHED" && newStatus === "FINISHED") {
        matchesNewlyFinished++
      }

      await prisma.match.upsert({
        where: { externalId: apiMatch.id },
        create: {
          externalId: apiMatch.id,
          tournamentId: tournament.id,
          stage: mapMatchStage(apiMatch.stage),
          group: extractGroupLetter(apiMatch.group),
          homeTeamId: homeTeamDbId,
          awayTeamId: awayTeamDbId,
          kickoffAt: new Date(apiMatch.utcDate),
          status: newStatus,
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
          status: newStatus,
          homeScore: apiMatch.score.fullTime.home,
          awayScore: apiMatch.score.fullTime.away,
          homeExtraTime: apiMatch.score.extraTime?.home ?? null,
          awayExtraTime: apiMatch.score.extraTime?.away ?? null,
          homePenalties: apiMatch.score.penalties?.home ?? null,
          awayPenalties: apiMatch.score.penalties?.away ?? null,
        },
      })
      matchesUpserted++
    }
    log.push(`✓ ${matchesUpserted} matchs synchronisés (${matchesNewlyFinished} nouveaux terminés)`)

    // ============================================
    // ÉTAPE 4 — Recalcul points si nouveaux matchs FINISHED
    // ============================================
    if (matchesNewlyFinished > 0) {
      const pointsResult = await calculateAllPointsInternal()
      if (pointsResult.ok) {
        log.push(`✓ ${pointsResult.totalUpdated} pronos recalculés`)
      } else {
        log.push(`⚠️ Erreur lors du recalcul des points`)
      }
    }

    const duration = Date.now() - startTime
    return NextResponse.json({
      ok: true,
      duration: `${duration}ms`,
      log,
    })

  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        log,
      },
      { status: 500 }
    )
  }
}