// ============================================
// FAKE DATA — Groupes Coupe du Monde 2026
// ============================================
// 12 groupes (A à L) de 4 équipes chacun.
// Format compatible avec football-data.org standings.
// ============================================

export type GroupTeam = {
  name: string
  shortName: string
  tla: string
  crest?: string
}

export type GroupStandingRow = {
  position: number
  team: GroupTeam
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export type FakeGroup = {
  letter: string  // "A", "B", ... "L"
  table: GroupStandingRow[]
}

// Helper pour générer une équipe
const t = (name: string, tla: string): GroupTeam => ({
  name,
  shortName: name,
  tla,
  crest: "",
})

// Helper pour générer une row "vide" (avant que la compétition commence)
const emptyRow = (position: number, team: GroupTeam): GroupStandingRow => ({
  position,
  team,
  playedGames: 0,
  won: 0,
  draw: 0,
  lost: 0,
  points: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
})

// ============================================
// LES 12 GROUPES — CDM 2026
// (composition basée sur le tirage au sort de décembre 2025
// + qualifiés des play-offs de mars 2026)
// ============================================

export const fakeGroups: FakeGroup[] = [
  {
    letter: "A",
    table: [
      emptyRow(1, t("Mexico", "MEX")),
      emptyRow(2, t("South Africa", "RSA")),
      emptyRow(3, t("Norway", "NOR")),
      emptyRow(4, t("Czechia", "CZE")),
    ],
  },
  {
    letter: "B",
    table: [
      emptyRow(1, t("Canada", "CAN")),
      emptyRow(2, t("Switzerland", "SUI")),
      emptyRow(3, t("Bosnia", "BIH")),
      emptyRow(4, t("Qatar", "QAT")),
    ],
  },
  {
    letter: "C",
    table: [
      emptyRow(1, t("Germany", "GER")),
      emptyRow(2, t("Poland", "POL")),
      emptyRow(3, t("Tunisia", "TUN")),
      emptyRow(4, t("New Zealand", "NZL")),
    ],
  },
  {
    letter: "D",
    table: [
      emptyRow(1, t("USA", "USA")),
      emptyRow(2, t("Türkiye", "TUR")),
      emptyRow(3, t("Australia", "AUS")),
      emptyRow(4, t("Paraguay", "PAR")),
    ],
  },
  {
    letter: "E",
    table: [
      emptyRow(1, t("France", "FRA")),
      emptyRow(2, t("Senegal", "SEN")),
      emptyRow(3, t("Iran", "IRN")),
      emptyRow(4, t("DR Congo", "COD")),
    ],
  },
  {
    letter: "F",
    table: [
      emptyRow(1, t("Argentina", "ARG")),
      emptyRow(2, t("Egypt", "EGY")),
      emptyRow(3, t("Algeria", "ALG")),
      emptyRow(4, t("Curaçao", "CUW")),
    ],
  },
  {
    letter: "G",
    table: [
      emptyRow(1, t("England", "ENG")),
      emptyRow(2, t("Croatia", "CRO")),
      emptyRow(3, t("Cameroon", "CMR")),
      emptyRow(4, t("Cape Verde", "CPV")),
    ],
  },
  {
    letter: "H",
    table: [
      emptyRow(1, t("Spain", "ESP")),
      emptyRow(2, t("Belgium", "BEL")),
      emptyRow(3, t("Saudi Arabia", "KSA")),
      emptyRow(4, t("Costa Rica", "CRC")),
    ],
  },
  {
    letter: "I",
    table: [
      emptyRow(1, t("Brazil", "BRA")),
      emptyRow(2, t("Portugal", "POR")),
      emptyRow(3, t("Morocco", "MAR")),
      emptyRow(4, t("Panama", "PAN")),
    ],
  },
  {
    letter: "J",
    table: [
      emptyRow(1, t("Netherlands", "NED")),
      emptyRow(2, t("Uruguay", "URU")),
      emptyRow(3, t("Japan", "JPN")),
      emptyRow(4, t("Ghana", "GHA")),
    ],
  },
  {
    letter: "K",
    table: [
      emptyRow(1, t("Italy", "ITA")),
      emptyRow(2, t("Colombia", "COL")),
      emptyRow(3, t("South Korea", "KOR")),
      emptyRow(4, t("Uzbekistan", "UZB")),
    ],
  },
  {
    letter: "L",
    table: [
      emptyRow(1, t("Denmark", "DEN")),
      emptyRow(2, t("Ecuador", "ECU")),
      emptyRow(3, t("Austria", "AUT")),
      emptyRow(4, t("Jordan", "JOR")),
    ],
  },
]

// ============================================
// EXEMPLE AVEC DONNÉES SIMULÉES
// (à utiliser pour visualiser un état "fin de phase de poules")
// ============================================
export const fakeGroupsWithResults: FakeGroup[] = fakeGroups.map((group, idx) => ({
  letter: group.letter,
  table: group.table.map((row, rowIdx) => {
    // Simulation : 1er = 7 pts, 2e = 5 pts, 3e = 3 pts, 4e = 1 pt
    const pointsByPos = [7, 5, 3, 1]
    const wonByPos = [2, 1, 1, 0]
    const drawByPos = [1, 2, 0, 1]
    const lostByPos = [0, 0, 2, 2]
    const gfByPos = [6, 4, 3, 2]
    const gaByPos = [2, 3, 4, 6]

    return {
      ...row,
      playedGames: 3,
      won: wonByPos[rowIdx],
      draw: drawByPos[rowIdx],
      lost: lostByPos[rowIdx],
      points: pointsByPos[rowIdx],
      goalsFor: gfByPos[rowIdx],
      goalsAgainst: gaByPos[rowIdx],
      goalDifference: gfByPos[rowIdx] - gaByPos[rowIdx],
    }
  }),
}))