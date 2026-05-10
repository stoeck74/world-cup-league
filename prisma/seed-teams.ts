import "dotenv/config"
import { prisma } from "../src/lib/prisma"

// ============================================
// SEED TEAMS — Coupe du Monde 2026
// ============================================
// La compétition WC sur football-data.org a l'ID 2000.
// On récupère les équipes qualifiées pour la phase finale.
//
// ⚠️ Le free tier de football-data.org pour la WC peut renvoyer
//    une liste partielle des qualifiés si la compétition n'est pas
//    encore complète (qualifs en cours / play-offs intercontinentaux).
// Si la sync API ne renvoie rien, le script bascule sur la liste FALLBACK
// hardcodée des 48 équipes connues à la date du 10 mai 2026.

const API_BASE = "https://api.football-data.org/v4"
const WC_CODE = "WC" // World Cup

type ApiTeam = {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
}

type ApiResponse = {
  count: number
  teams: ApiTeam[]
}

// Liste de fallback : 48 nations qualifiées pour la CDM 2026
// (à compléter avec les vrais externalId si nécessaire — ici on utilise des IDs négatifs
//  fictifs pour ne pas entrer en conflit avec les vrais IDs Football-Data si on les ajoute après)
const FALLBACK_TEAMS: Omit<ApiTeam, "id">[] = [
  // Hôtes
  { name: "Canada", shortName: "Canada", tla: "CAN", crest: "" },
  { name: "Mexico", shortName: "Mexico", tla: "MEX", crest: "" },
  { name: "United States", shortName: "USA", tla: "USA", crest: "" },
  // UEFA (16)
  { name: "France", shortName: "France", tla: "FRA", crest: "" },
  { name: "Spain", shortName: "Spain", tla: "ESP", crest: "" },
  { name: "England", shortName: "England", tla: "ENG", crest: "" },
  { name: "Germany", shortName: "Germany", tla: "GER", crest: "" },
  { name: "Italy", shortName: "Italy", tla: "ITA", crest: "" },
  { name: "Portugal", shortName: "Portugal", tla: "POR", crest: "" },
  { name: "Netherlands", shortName: "Netherlands", tla: "NED", crest: "" },
  { name: "Belgium", shortName: "Belgium", tla: "BEL", crest: "" },
  { name: "Croatia", shortName: "Croatia", tla: "CRO", crest: "" },
  { name: "Switzerland", shortName: "Switzerland", tla: "SUI", crest: "" },
  { name: "Denmark", shortName: "Denmark", tla: "DEN", crest: "" },
  { name: "Austria", shortName: "Austria", tla: "AUT", crest: "" },
  { name: "Poland", shortName: "Poland", tla: "POL", crest: "" },
  { name: "Czechia", shortName: "Czechia", tla: "CZE", crest: "" },
  { name: "Norway", shortName: "Norway", tla: "NOR", crest: "" },
  { name: "Turkey", shortName: "Turkey", tla: "TUR", crest: "" },
  { name: "Scotland", shortName: "Scotland", tla: "SCO", crest: "" },
  // CONMEBOL (6)
  { name: "Argentina", shortName: "Argentina", tla: "ARG", crest: "" },
  { name: "Brazil", shortName: "Brazil", tla: "BRA", crest: "" },
  { name: "Uruguay", shortName: "Uruguay", tla: "URU", crest: "" },
  { name: "Colombia", shortName: "Colombia", tla: "COL", crest: "" },
  { name: "Ecuador", shortName: "Ecuador", tla: "ECU", crest: "" },
  { name: "Paraguay", shortName: "Paraguay", tla: "PAR", crest: "" },
  // CONCACAF (extra) (3 supplémentaires + 2 hôtes déjà comptés)
  { name: "Costa Rica", shortName: "Costa Rica", tla: "CRC", crest: "" },
  { name: "Panama", shortName: "Panama", tla: "PAN", crest: "" },
  { name: "Curaçao", shortName: "Curaçao", tla: "CUW", crest: "" },
  // AFC (8)
  { name: "Japan", shortName: "Japan", tla: "JPN", crest: "" },
  { name: "South Korea", shortName: "South Korea", tla: "KOR", crest: "" },
  { name: "Iran", shortName: "Iran", tla: "IRN", crest: "" },
  { name: "Australia", shortName: "Australia", tla: "AUS", crest: "" },
  { name: "Saudi Arabia", shortName: "Saudi Arabia", tla: "KSA", crest: "" },
  { name: "Qatar", shortName: "Qatar", tla: "QAT", crest: "" },
  { name: "Uzbekistan", shortName: "Uzbekistan", tla: "UZB", crest: "" },
  { name: "Jordan", shortName: "Jordan", tla: "JOR", crest: "" },
  // CAF (9)
  { name: "Morocco", shortName: "Morocco", tla: "MAR", crest: "" },
  { name: "Senegal", shortName: "Senegal", tla: "SEN", crest: "" },
  { name: "Egypt", shortName: "Egypt", tla: "EGY", crest: "" },
  { name: "Tunisia", shortName: "Tunisia", tla: "TUN", crest: "" },
  { name: "Algeria", shortName: "Algeria", tla: "ALG", crest: "" },
  { name: "Cameroon", shortName: "Cameroon", tla: "CMR", crest: "" },
  { name: "Ghana", shortName: "Ghana", tla: "GHA", crest: "" },
  { name: "South Africa", shortName: "South Africa", tla: "RSA", crest: "" },
  { name: "Cape Verde", shortName: "Cape Verde", tla: "CPV", crest: "" },
  // OFC (1)
  { name: "New Zealand", shortName: "New Zealand", tla: "NZL", crest: "" },
  // Play-offs intercontinentaux (2 places)
  { name: "Bosnia & Herzegovina", shortName: "Bosnia", tla: "BIH", crest: "" },
  { name: "DR Congo", shortName: "DR Congo", tla: "COD", crest: "" },
]

async function fetchWorldCupTeams(): Promise<ApiTeam[]> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY

  if (!apiKey) {
    console.warn("⚠️  FOOTBALL_DATA_API_KEY manquante — utilisation du fallback hardcodé")
    return []
  }

  try {
    console.log("🌐 Appel à football-data.org pour récupérer les équipes du Mondial...")
    const response = await fetch(`${API_BASE}/competitions/${WC_CODE}/teams`, {
      headers: { "X-Auth-Token": apiKey },
    })

    if (!response.ok) {
      console.warn(`⚠️  API error: ${response.status} — utilisation du fallback`)
      return []
    }

    const data: ApiResponse = await response.json()
    console.log(`✅ ${data.count} équipes récupérées depuis l'API`)
    return data.teams
  } catch (e) {
    console.warn("⚠️  Erreur API:", e, "— utilisation du fallback")
    return []
  }
}

async function seedTeams() {
  console.log("🌱 Démarrage du seed des équipes du Mondial 2026...\n")

  const apiTeams = await fetchWorldCupTeams()

  // Si l'API ne renvoie rien, on utilise le fallback hardcodé
  const teamsToInsert: ApiTeam[] =
    apiTeams.length > 0
      ? apiTeams
      : FALLBACK_TEAMS.map((t, idx) => ({
          ...t,
          id: -(idx + 1), // ID négatif pour distinguer du vrai ID API
        }))

  console.log("\n💾 Insertion en base...")

  for (const apiTeam of teamsToInsert) {
    const team = await prisma.team.upsert({
      where: { externalId: apiTeam.id },
      update: {
        name: apiTeam.name,
        shortName: apiTeam.shortName,
        tla: apiTeam.tla,
        crestUrl: apiTeam.crest || null,
      },
      create: {
        externalId: apiTeam.id,
        name: apiTeam.name,
        shortName: apiTeam.shortName,
        tla: apiTeam.tla,
        crestUrl: apiTeam.crest || null,
      },
    })
    console.log(`  ✓ ${team.tla} - ${team.name}`)
  }

  // Création du tournoi (si pas déjà là)
  const tournament = await prisma.tournament.upsert({
    where: { externalId: 2000 }, // ID football-data pour la WC
    update: {
      isActive: true,
    },
    create: {
      name: "FIFA World Cup 2026",
      externalId: 2000,
      startDate: new Date("2026-06-11"),
      endDate: new Date("2026-07-19"),
      isActive: true,
    },
  })

  console.log(`\n🏆 Tournoi: ${tournament.name} (${tournament.startDate.toLocaleDateString("fr-FR")} → ${tournament.endDate.toLocaleDateString("fr-FR")})`)
  console.log("\n✅ Seed terminé !")
}

seedTeams()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
