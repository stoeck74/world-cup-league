// ============================================
// FAKE DATA — Page Matchs (Coupe du Monde 2026)
//
// Structure :
//  - Phase de groupes : 12 groupes (A → L), 4 équipes chacun, 3 matchs par équipe
//  - Round of 32 : 16 matchs (les 32 qualifiés des groupes)
//  - Round of 16 : 8 matchs
//  - Quarter : 4 matchs
//  - Semi : 2 matchs
//  - Third place : 1 match
//  - Final : 1 match
//
// Total : 104 matchs (mais ici on met juste un échantillon pour V1).
// ============================================

export type MatchStatus = "scheduled" | "live" | "finished" | "locked"

export type FakeStage =
  | "GROUP"
  | "ROUND_32"
  | "ROUND_16"
  | "QUARTER"
  | "SEMI"
  | "THIRD_PLACE"
  | "FINAL"

export type FakeMatchTeam = {
  name: string
  shortName: string
  tla: string
  crest: string
}

export type FakeMatchDetailed = {
  id: string
  stage: FakeStage
  group?: string
  homeTeam: FakeMatchTeam | null
  awayTeam: FakeMatchTeam | null
  kickoffDate: string
  kickoffTime: string
  status: MatchStatus
  homeScore?: number
  awayScore?: number
  myHomePrediction?: number | null
  myAwayPrediction?: number | null
  myQualifierPrediction?: string | null // tla de l'équipe que je pense voir passer
  myPoints?: number
}

// ============================================
// HELPER — Construire une équipe rapidement
// ============================================
const team = (name: string, tla: string): FakeMatchTeam => ({
  name,
  shortName: name,
  tla,
  crest: "", // remplacé par l'API au moment du sync réel
})

// ============================================
// PHASE DE POULES — Échantillon (3 matchs)
// La vraie liste viendra de l'API au moment du sync
// ============================================
export const fakeGroupMatches: FakeMatchDetailed[] = [
  {
    id: "g-a-1",
    stage: "GROUP",
    group: "A",
    homeTeam: team("Mexico", "MEX"),
    awayTeam: team("South Africa", "RSA"),
    kickoffDate: "Jeudi 11 juin",
    kickoffTime: "20:00",
    status: "scheduled",
    myHomePrediction: 2,
    myAwayPrediction: 0,
  },
  {
    id: "g-d-1",
    stage: "GROUP",
    group: "D",
    homeTeam: team("USA", "USA"),
    awayTeam: team("Paraguay", "PAR"),
    kickoffDate: "Vendredi 12 juin",
    kickoffTime: "21:00",
    status: "scheduled",
    myHomePrediction: null,
    myAwayPrediction: null,
  },
  {
    id: "g-b-1",
    stage: "GROUP",
    group: "B",
    homeTeam: team("Canada", "CAN"),
    awayTeam: team("Bosnia", "BIH"),
    kickoffDate: "Vendredi 12 juin",
    kickoffTime: "18:00",
    status: "scheduled",
    myHomePrediction: 1,
    myAwayPrediction: 1,
  },
]

// ============================================
// ROUND OF 32 — placeholder
// Les équipes seront connues à la fin de la phase de poules
// ============================================
export const fakeRound32Matches: FakeMatchDetailed[] = [
  {
    id: "r32-1",
    stage: "ROUND_32",
    homeTeam: null, // 1er Groupe A
    awayTeam: null, // 3e Groupe B/E/F
    kickoffDate: "À déterminer",
    kickoffTime: "—",
    status: "scheduled",
  },
]

// ============================================
// HELPER — Récupérer les matchs d'une phase
// ============================================
export function getMatchesByStage(stage: FakeStage): FakeMatchDetailed[] {
  switch (stage) {
    case "GROUP":
      return fakeGroupMatches
    case "ROUND_32":
      return fakeRound32Matches
    default:
      return []
  }
}

// ============================================
// LISTE DES PHASES
// ============================================
export type FakeStageInfo = {
  key: FakeStage
  label: string
  status: "past" | "current" | "future"
  matchesCount: number
}

export const fakeStages: FakeStageInfo[] = [
  { key: "GROUP", label: "Phase de poules", status: "current", matchesCount: 72 },
  { key: "ROUND_32", label: "1/16e de finale", status: "future", matchesCount: 16 },
  { key: "ROUND_16", label: "1/8e de finale", status: "future", matchesCount: 8 },
  { key: "QUARTER", label: "Quarts", status: "future", matchesCount: 4 },
  { key: "SEMI", label: "Demi-finales", status: "future", matchesCount: 2 },
  { key: "THIRD_PLACE", label: "Petite finale", status: "future", matchesCount: 1 },
  { key: "FINAL", label: "Finale", status: "future", matchesCount: 1 },
]
