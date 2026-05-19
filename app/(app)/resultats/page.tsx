import { auth } from "@/../auth"
import { GroupStage } from "@/components/groups/GroupStage"
import { prisma } from "@/lib/prisma"
import type { FakeGroup, GroupStandingRow } from "@/lib/fake-data/groups"

export default async function ResultatsPage() {
  const session = await auth()
  if (!session) return null

  // Charge les matchs de phase de poules avec teams
  const groupMatches = await prisma.match.findMany({
    where: { stage: "GROUP" },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  })

  const groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

  // Calcule les classements par groupe
  const groups: FakeGroup[] = groupLetters.map((letter) => {
    const matchesOfGroup = groupMatches.filter((m) => m.group === letter)

    // Collecte les équipes uniques
const teamsMap = new Map<string, { name: string; shortName: string; tla: string; crest: string }>()
    matchesOfGroup.forEach((m) => {
      if (m.homeTeam) {
        teamsMap.set(m.homeTeam.id, {
          name: m.homeTeam.name,
          shortName: m.homeTeam.shortName,
          tla: m.homeTeam.tla,
          crest: m.homeTeam.crestUrl ?? "",
        })
      }
      if (m.awayTeam) {
        teamsMap.set(m.awayTeam.id, {
          name: m.awayTeam.name,
          shortName: m.awayTeam.shortName,
          tla: m.awayTeam.tla,
          crest: m.awayTeam.crestUrl ?? "",
        })
      }
    })

    // Calcule les stats par équipe
    const rows: GroupStandingRow[] = []
    teamsMap.forEach((team, teamId) => {
      let playedGames = 0
      let won = 0
      let draw = 0
      let lost = 0
      let goalsFor = 0
      let goalsAgainst = 0

      matchesOfGroup.forEach((m) => {
        if (m.status !== "FINISHED" || m.homeScore === null || m.awayScore === null) return

        const isHome = m.homeTeamId === teamId
        const isAway = m.awayTeamId === teamId
        if (!isHome && !isAway) return

        playedGames++
        const teamScore = isHome ? m.homeScore : m.awayScore
        const opponentScore = isHome ? m.awayScore : m.homeScore

        goalsFor += teamScore
        goalsAgainst += opponentScore

        if (teamScore > opponentScore) won++
        else if (teamScore === opponentScore) draw++
        else lost++
      })

      const points = won * 3 + draw

      rows.push({
        position: 0,
        team,
        playedGames,
        won,
        draw,
        lost,
        points,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
      })
    })

    // Tri : points → diff buts → buts marqués
    rows.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    // Assigne les positions
    rows.forEach((row, idx) => {
      row.position = idx + 1
    })

    return { letter, table: rows }
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-results h-screen">
      <div className="max-w-fullmx-auto">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            Classements
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Phase de <span className="text-accent">poules</span>
          </h1>
          <p className="text-text-secondary mt-1">
            12 groupes · 48 nations · 72 matchs
          </p>
        </header>

        <GroupStage groups={groups} />
      </div>
    </div>
  )
}