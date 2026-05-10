// ============================================
// FAKE DATA — Dashboard (Coupe du Monde 2026)
// À remplacer par de vraies données plus tard
// ============================================

export const fakeUser = {
  username: "admin",
  position: 3,
  totalPlayers: 8,
  totalPoints: 24,
  pointsLastStage: 6,
  exactScores: 2,
  goodResults: 8,
  successRate: 62,
}

export const fakeCurrentStage = {
  label: "Phase de poules",
  stageKey: "GROUP",
  startDate: "Jeudi 11 juin",
  startTime: "20:00",
  matchesCount: 72,
  predictionsMade: 0,
}

export const fakeUpcomingMatches = [
  {
    id: "m-1",
    homeTeamName: "France",
    homeTeamTla: "FRA",
    awayTeamName: "Argentina",
    awayTeamTla: "ARG",
    kickoffDate: "Jeudi 11 juin",
    kickoffTime: "21:00",
    group: "A",
  },
  {
    id: "m-2",
    homeTeamName: "Spain",
    homeTeamTla: "ESP",
    awayTeamName: "Brazil",
    awayTeamTla: "BRA",
    kickoffDate: "Vendredi 12 juin",
    kickoffTime: "18:00",
    group: "B",
  },
  {
    id: "m-3",
    homeTeamName: "England",
    homeTeamTla: "ENG",
    awayTeamName: "Germany",
    awayTeamTla: "GER",
    kickoffDate: "Vendredi 12 juin",
    kickoffTime: "21:00",
    group: "C",
  },
]

export const fakeLeaderboardTop = [
  { position: 1, username: "marco_pronos", points: 32, isMe: false },
  { position: 2, username: "lucky_luke", points: 28, isMe: false },
  { position: 3, username: "admin", points: 24, isMe: true },
  { position: 4, username: "thibault_om", points: 21, isMe: false },
  { position: 5, username: "fabrice_psg", points: 18, isMe: false },
]

// Évolution des points (matchs joués cumulés sur la phase de poules)
export const fakePointsHistory = [
  { match: 1, points: 1 },
  { match: 2, points: 4 },
  { match: 3, points: 4 },
  { match: 4, points: 7 },
  { match: 5, points: 7 },
  { match: 6, points: 10 },
  { match: 7, points: 13 },
  { match: 8, points: 13 },
  { match: 9, points: 16 },
  { match: 10, points: 16 },
  { match: 11, points: 19 },
  { match: 12, points: 22 },
  { match: 13, points: 24 },
]

export const fakeLastResults = [
  {
    homeTeamTla: "FRA",
    homeScore: 2,
    awayTeamTla: "USA",
    awayScore: 1,
    myHomePrediction: 2,
    myAwayPrediction: 0,
    myPoints: 1,
  },
  {
    homeTeamTla: "ARG",
    homeScore: 0,
    awayTeamTla: "MAR",
    awayScore: 0,
    myHomePrediction: 1,
    myAwayPrediction: 1,
    myPoints: 1,
  },
  {
    homeTeamTla: "BRA",
    homeScore: 3,
    awayTeamTla: "JPN",
    awayScore: 1,
    myHomePrediction: 3,
    myAwayPrediction: 1,
    myPoints: 3,
  },
  {
    homeTeamTla: "ESP",
    homeScore: 1,
    awayTeamTla: "GER",
    awayScore: 2,
    myHomePrediction: 0,
    myAwayPrediction: 0,
    myPoints: 0,
  },
]
