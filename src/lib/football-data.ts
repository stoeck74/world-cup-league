// ============================================
// FOOTBALL-DATA.ORG API CLIENT
// Service qui fetch les données de la FIFA World Cup 2026
// ============================================

const API_BASE = "https://api.football-data.org/v4"
const COMPETITION_CODE = "WC"

// Types bruts de l'API
export type ApiTeam = {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
}

export type ApiMatch = {
  id: number
  utcDate: string
  status: "TIMED" | "SCHEDULED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED"
  stage: string  // "GROUP_STAGE", "LAST_16", "QUARTER_FINALS", etc.
  group: string | null  // "GROUP_A", null pour KO
  homeTeam: ApiTeam | null
  awayTeam: ApiTeam | null
  score: {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null
    duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT"
    fullTime: { home: number | null; away: number | null }
    halfTime: { home: number | null; away: number | null }
    extraTime?: { home: number | null; away: number | null }
    penalties?: { home: number | null; away: number | null }
  }
}

type MatchesResponse = {
  resultSet: { count: number; first: string; last: string; played: number }
  matches: ApiMatch[]
}

type TeamsResponse = {
  count: number
  teams: ApiTeam[]
}

// ============================================
// FETCH HELPER
// ============================================
async function apiFetch<T>(endpoint: string): Promise<T> {
  const token = process.env.FOOTBALL_DATA_API_KEY
  if (!token) {
    throw new Error("FOOTBALL_DATA_API_KEY is not defined in .env")
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "X-Auth-Token": token,
    },
    // Pas de cache pour les données en live
    cache: "no-store",
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `football-data.org API error: ${response.status} ${response.statusText} — ${text}`
    )
  }

  return response.json() as Promise<T>
}

// ============================================
// PUBLIC API
// ============================================

/** Récupère la liste des 48 équipes qualifiées pour la WC */
export async function fetchTeams(): Promise<ApiTeam[]> {
  const data = await apiFetch<TeamsResponse>(`/competitions/${COMPETITION_CODE}/teams`)
  return data.teams
}

/** Récupère les 104 matchs de la WC */
export async function fetchMatches(): Promise<ApiMatch[]> {
  const data = await apiFetch<MatchesResponse>(`/competitions/${COMPETITION_CODE}/matches`)
  return data.matches
}

// ============================================
// MAPPERS (API → DB)
// ============================================

/** Map le statut API vers notre enum DB */
export function mapMatchStatus(apiStatus: ApiMatch["status"]): "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" {
  switch (apiStatus) {
    case "TIMED":
    case "SCHEDULED":
      return "SCHEDULED"
    case "IN_PLAY":
    case "PAUSED":
      return "LIVE"
    case "FINISHED":
      return "FINISHED"
    case "POSTPONED":
    case "SUSPENDED":
    case "CANCELLED":
      return "POSTPONED"
    default:
      return "SCHEDULED"
  }
}

/** Map le stage API vers notre enum DB */
export function mapMatchStage(apiStage: string): "GROUP" | "ROUND_32" | "ROUND_16" | "QUARTER" | "SEMI" | "THIRD_PLACE" | "FINAL" {
  switch (apiStage) {
    case "GROUP_STAGE":
      return "GROUP"
    case "LAST_32":
      return "ROUND_32"
    case "LAST_16":
      return "ROUND_16"
    case "QUARTER_FINALS":
      return "QUARTER"
    case "SEMI_FINALS":
      return "SEMI"
    case "THIRD_PLACE":
      return "THIRD_PLACE"
    case "FINAL":
      return "FINAL"
    default:
      console.warn(`Unknown match stage: ${apiStage}, defaulting to GROUP`)
      return "GROUP"
  }
}

/** Extrait la lettre du groupe ("GROUP_A" → "A") */
export function extractGroupLetter(apiGroup: string | null): string | null {
  if (!apiGroup) return null
  const match = apiGroup.match(/^GROUP_([A-L])$/)
  return match ? match[1] : null
}