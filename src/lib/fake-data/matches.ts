// ============================================
// FAKE DATA — Phase de poules CDM 2026
// 72 vrais matchs avec dates et heures CET
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
  name: string       // nom en français
  shortName: string
  tla: string
  crest: string
}

export type FakeMatchDetailed = {
  id: string
  stage: FakeStage
  group?: string

  // Placeholders pour les KO (toujours présents, viennent du calendrier FIFA)
  // Pour les matchs de poule : null (équipes toujours connues d'office)
  homePlaceholder?: string  // ex: "1er Groupe A", "V. M89"
  awayPlaceholder?: string

  // Vraies équipes (null tant que les qualifiés ne sont pas connus pour les KO)
  homeTeam: FakeMatchTeam | null
  awayTeam: FakeMatchTeam | null

  kickoffDate: string
  kickoffTime: string
  venue?: string
  status: MatchStatus
  homeScore?: number
  awayScore?: number
  myHomePrediction?: number | null
  myAwayPrediction?: number | null
  myQualifierPrediction?: string | null
  myPoints?: number
}

// Helper pour construire une équipe rapidement (en français)
const t = (name: string, tla: string): FakeMatchTeam => ({
  name,
  shortName: name,
  tla,
  crest: "",
})

// ============================================
// PHASE DE POULES — 72 matchs
// Heures en CET (heure française d'été)
// ============================================
export const fakeGroupMatches: FakeMatchDetailed[] = [
  // ═══════════════════════════════════════════
  // JEUDI 11 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-001", stage: "GROUP", group: "A",
    homeTeam: t("Mexique", "MEX"), awayTeam: t("Afrique du Sud", "RSA"),
    kickoffDate: "Jeudi 11 juin", kickoffTime: "21:00",
    venue: "Estadio Azteca, Mexico", status: "scheduled",
  },
  {
    id: "g-002", stage: "GROUP", group: "A",
    homeTeam: t("Corée du Sud", "KOR"), awayTeam: t("Tchéquie", "CZE"),
    kickoffDate: "Vendredi 12 juin", kickoffTime: "04:00",
    venue: "Estadio Akron, Zapopan", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // VENDREDI 12 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-003", stage: "GROUP", group: "B",
    homeTeam: t("Canada", "CAN"), awayTeam: t("Bosnie", "BIH"),
    kickoffDate: "Vendredi 12 juin", kickoffTime: "21:00",
    venue: "BMO Field, Toronto", status: "scheduled",
  },
  {
    id: "g-004", stage: "GROUP", group: "D",
    homeTeam: t("États-Unis", "USA"), awayTeam: t("Paraguay", "PAR"),
    kickoffDate: "Samedi 13 juin", kickoffTime: "03:00",
    venue: "SoFi Stadium, Inglewood", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // SAMEDI 13 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-005", stage: "GROUP", group: "B",
    homeTeam: t("Qatar", "QAT"), awayTeam: t("Suisse", "SUI"),
    kickoffDate: "Samedi 13 juin", kickoffTime: "21:00",
    venue: "Levi's Stadium, Santa Clara", status: "scheduled",
  },
  {
    id: "g-006", stage: "GROUP", group: "C",
    homeTeam: t("Brésil", "BRA"), awayTeam: t("Maroc", "MAR"),
    kickoffDate: "Dimanche 14 juin", kickoffTime: "00:00",
    venue: "MetLife Stadium, East Rutherford", status: "scheduled",
  },
  {
    id: "g-007", stage: "GROUP", group: "C",
    homeTeam: t("Haïti", "HAI"), awayTeam: t("Écosse", "SCO"),
    kickoffDate: "Dimanche 14 juin", kickoffTime: "03:00",
    venue: "Gillette Stadium, Foxborough", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // DIMANCHE 14 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-008", stage: "GROUP", group: "D",
    homeTeam: t("Australie", "AUS"), awayTeam: t("Türkiye", "TUR"),
    kickoffDate: "Dimanche 14 juin", kickoffTime: "06:00",
    venue: "BC Place, Vancouver", status: "scheduled",
  },
  {
    id: "g-009", stage: "GROUP", group: "E",
    homeTeam: t("Allemagne", "GER"), awayTeam: t("Curaçao", "CUW"),
    kickoffDate: "Dimanche 14 juin", kickoffTime: "19:00",
    venue: "NRG Stadium, Houston", status: "scheduled",
  },
  {
    id: "g-010", stage: "GROUP", group: "F",
    homeTeam: t("Pays-Bas", "NED"), awayTeam: t("Japon", "JPN"),
    kickoffDate: "Dimanche 14 juin", kickoffTime: "22:00",
    venue: "AT&T Stadium, Arlington", status: "scheduled",
  },
  {
    id: "g-011", stage: "GROUP", group: "E",
    homeTeam: t("Côte d'Ivoire", "CIV"), awayTeam: t("Équateur", "ECU"),
    kickoffDate: "Lundi 15 juin", kickoffTime: "01:00",
    venue: "Lincoln Financial Field, Philadelphia", status: "scheduled",
  },
  {
    id: "g-012", stage: "GROUP", group: "F",
    homeTeam: t("Suède", "SWE"), awayTeam: t("Tunisie", "TUN"),
    kickoffDate: "Lundi 15 juin", kickoffTime: "04:00",
    venue: "Estadio BBVA, Monterrey", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // LUNDI 15 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-013", stage: "GROUP", group: "H",
    homeTeam: t("Espagne", "ESP"), awayTeam: t("Cap-Vert", "CPV"),
    kickoffDate: "Lundi 15 juin", kickoffTime: "18:00",
    venue: "Mercedes-Benz Stadium, Atlanta", status: "scheduled",
  },
  {
    id: "g-014", stage: "GROUP", group: "G",
    homeTeam: t("Belgique", "BEL"), awayTeam: t("Égypte", "EGY"),
    kickoffDate: "Lundi 15 juin", kickoffTime: "21:00",
    venue: "Lumen Field, Seattle", status: "scheduled",
  },
  {
    id: "g-015", stage: "GROUP", group: "H",
    homeTeam: t("Arabie saoudite", "KSA"), awayTeam: t("Uruguay", "URU"),
    kickoffDate: "Mardi 16 juin", kickoffTime: "00:00",
    venue: "Hard Rock Stadium, Miami Gardens", status: "scheduled",
  },
  {
    id: "g-016", stage: "GROUP", group: "G",
    homeTeam: t("Iran", "IRN"), awayTeam: t("Nouvelle-Zélande", "NZL"),
    kickoffDate: "Mardi 16 juin", kickoffTime: "03:00",
    venue: "SoFi Stadium, Inglewood", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // MARDI 16 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-017", stage: "GROUP", group: "I",
    homeTeam: t("France", "FRA"), awayTeam: t("Sénégal", "SEN"),
    kickoffDate: "Mardi 16 juin", kickoffTime: "21:00",
    venue: "MetLife Stadium, East Rutherford", status: "scheduled",
  },
  {
    id: "g-018", stage: "GROUP", group: "I",
    homeTeam: t("Irak", "IRQ"), awayTeam: t("Norvège", "NOR"),
    kickoffDate: "Mercredi 17 juin", kickoffTime: "00:00",
    venue: "Gillette Stadium, Foxborough", status: "scheduled",
  },
  {
    id: "g-019", stage: "GROUP", group: "J",
    homeTeam: t("Argentine", "ARG"), awayTeam: t("Algérie", "ALG"),
    kickoffDate: "Mercredi 17 juin", kickoffTime: "03:00",
    venue: "Arrowhead Stadium, Kansas City", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // MERCREDI 17 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-020", stage: "GROUP", group: "J",
    homeTeam: t("Autriche", "AUT"), awayTeam: t("Jordanie", "JOR"),
    kickoffDate: "Mercredi 17 juin", kickoffTime: "06:00",
    venue: "Levi's Stadium, Santa Clara", status: "scheduled",
  },
  {
    id: "g-021", stage: "GROUP", group: "K",
    homeTeam: t("Portugal", "POR"), awayTeam: t("RD Congo", "COD"),
    kickoffDate: "Mercredi 17 juin", kickoffTime: "19:00",
    venue: "NRG Stadium, Houston", status: "scheduled",
  },
  {
    id: "g-022", stage: "GROUP", group: "L",
    homeTeam: t("Angleterre", "ENG"), awayTeam: t("Croatie", "CRO"),
    kickoffDate: "Mercredi 17 juin", kickoffTime: "22:00",
    venue: "AT&T Stadium, Arlington", status: "scheduled",
  },
  {
    id: "g-023", stage: "GROUP", group: "L",
    homeTeam: t("Ghana", "GHA"), awayTeam: t("Panama", "PAN"),
    kickoffDate: "Jeudi 18 juin", kickoffTime: "01:00",
    venue: "BMO Field, Toronto", status: "scheduled",
  },
  {
    id: "g-024", stage: "GROUP", group: "K",
    homeTeam: t("Ouzbékistan", "UZB"), awayTeam: t("Colombie", "COL"),
    kickoffDate: "Jeudi 18 juin", kickoffTime: "04:00",
    venue: "Estadio Azteca, Mexico", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // JEUDI 18 JUIN — 2e journée commence
  // ═══════════════════════════════════════════
  {
    id: "g-025", stage: "GROUP", group: "A",
    homeTeam: t("Tchéquie", "CZE"), awayTeam: t("Afrique du Sud", "RSA"),
    kickoffDate: "Jeudi 18 juin", kickoffTime: "18:00",
    venue: "Mercedes-Benz Stadium, Atlanta", status: "scheduled",
  },
  {
    id: "g-026", stage: "GROUP", group: "B",
    homeTeam: t("Suisse", "SUI"), awayTeam: t("Bosnie", "BIH"),
    kickoffDate: "Jeudi 18 juin", kickoffTime: "21:00",
    venue: "SoFi Stadium, Inglewood", status: "scheduled",
  },
  {
    id: "g-027", stage: "GROUP", group: "B",
    homeTeam: t("Canada", "CAN"), awayTeam: t("Qatar", "QAT"),
    kickoffDate: "Vendredi 19 juin", kickoffTime: "00:00",
    venue: "BC Place, Vancouver", status: "scheduled",
  },
  {
    id: "g-028", stage: "GROUP", group: "A",
    homeTeam: t("Mexique", "MEX"), awayTeam: t("Corée du Sud", "KOR"),
    kickoffDate: "Vendredi 19 juin", kickoffTime: "03:00",
    venue: "Estadio Akron, Zapopan", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // VENDREDI 19 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-029", stage: "GROUP", group: "D",
    homeTeam: t("États-Unis", "USA"), awayTeam: t("Australie", "AUS"),
    kickoffDate: "Vendredi 19 juin", kickoffTime: "21:00",
    venue: "Lumen Field, Seattle", status: "scheduled",
  },
  {
    id: "g-030", stage: "GROUP", group: "C",
    homeTeam: t("Écosse", "SCO"), awayTeam: t("Maroc", "MAR"),
    kickoffDate: "Samedi 20 juin", kickoffTime: "00:00",
    venue: "Gillette Stadium, Foxborough", status: "scheduled",
  },
  {
    id: "g-031", stage: "GROUP", group: "C",
    homeTeam: t("Brésil", "BRA"), awayTeam: t("Haïti", "HAI"),
    kickoffDate: "Samedi 20 juin", kickoffTime: "02:30",
    venue: "Lincoln Financial Field, Philadelphia", status: "scheduled",
  },
  {
    id: "g-032", stage: "GROUP", group: "D",
    homeTeam: t("Türkiye", "TUR"), awayTeam: t("Paraguay", "PAR"),
    kickoffDate: "Samedi 20 juin", kickoffTime: "05:00",
    venue: "Levi's Stadium, Santa Clara", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // SAMEDI 20 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-033", stage: "GROUP", group: "F",
    homeTeam: t("Pays-Bas", "NED"), awayTeam: t("Suède", "SWE"),
    kickoffDate: "Samedi 20 juin", kickoffTime: "19:00",
    venue: "NRG Stadium, Houston", status: "scheduled",
  },
  {
    id: "g-034", stage: "GROUP", group: "E",
    homeTeam: t("Allemagne", "GER"), awayTeam: t("Côte d'Ivoire", "CIV"),
    kickoffDate: "Samedi 20 juin", kickoffTime: "22:00",
    venue: "BMO Field, Toronto", status: "scheduled",
  },
  {
    id: "g-035", stage: "GROUP", group: "E",
    homeTeam: t("Équateur", "ECU"), awayTeam: t("Curaçao", "CUW"),
    kickoffDate: "Dimanche 21 juin", kickoffTime: "02:00",
    venue: "Arrowhead Stadium, Kansas City", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // DIMANCHE 21 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-036", stage: "GROUP", group: "F",
    homeTeam: t("Tunisie", "TUN"), awayTeam: t("Japon", "JPN"),
    kickoffDate: "Dimanche 21 juin", kickoffTime: "06:00",
    venue: "Estadio BBVA, Monterrey", status: "scheduled",
  },
  {
    id: "g-037", stage: "GROUP", group: "H",
    homeTeam: t("Espagne", "ESP"), awayTeam: t("Arabie saoudite", "KSA"),
    kickoffDate: "Dimanche 21 juin", kickoffTime: "18:00",
    venue: "Mercedes-Benz Stadium, Atlanta", status: "scheduled",
  },
  {
    id: "g-038", stage: "GROUP", group: "G",
    homeTeam: t("Belgique", "BEL"), awayTeam: t("Iran", "IRN"),
    kickoffDate: "Dimanche 21 juin", kickoffTime: "21:00",
    venue: "SoFi Stadium, Inglewood", status: "scheduled",
  },
  {
    id: "g-039", stage: "GROUP", group: "H",
    homeTeam: t("Uruguay", "URU"), awayTeam: t("Cap-Vert", "CPV"),
    kickoffDate: "Lundi 22 juin", kickoffTime: "00:00",
    venue: "Hard Rock Stadium, Miami Gardens", status: "scheduled",
  },
  {
    id: "g-040", stage: "GROUP", group: "G",
    homeTeam: t("Nouvelle-Zélande", "NZL"), awayTeam: t("Égypte", "EGY"),
    kickoffDate: "Lundi 22 juin", kickoffTime: "03:00",
    venue: "BC Place, Vancouver", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // LUNDI 22 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-041", stage: "GROUP", group: "J",
    homeTeam: t("Argentine", "ARG"), awayTeam: t("Autriche", "AUT"),
    kickoffDate: "Lundi 22 juin", kickoffTime: "19:00",
    venue: "AT&T Stadium, Arlington", status: "scheduled",
  },
  {
    id: "g-042", stage: "GROUP", group: "I",
    homeTeam: t("France", "FRA"), awayTeam: t("Irak", "IRQ"),
    kickoffDate: "Lundi 22 juin", kickoffTime: "23:00",
    venue: "Lincoln Financial Field, Philadelphia", status: "scheduled",
  },
  {
    id: "g-043", stage: "GROUP", group: "I",
    homeTeam: t("Norvège", "NOR"), awayTeam: t("Sénégal", "SEN"),
    kickoffDate: "Mardi 23 juin", kickoffTime: "02:00",
    venue: "MetLife Stadium, East Rutherford", status: "scheduled",
  },
  {
    id: "g-044", stage: "GROUP", group: "J",
    homeTeam: t("Jordanie", "JOR"), awayTeam: t("Algérie", "ALG"),
    kickoffDate: "Mardi 23 juin", kickoffTime: "05:00",
    venue: "Levi's Stadium, Santa Clara", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // MARDI 23 JUIN
  // ═══════════════════════════════════════════
  {
    id: "g-045", stage: "GROUP", group: "K",
    homeTeam: t("Portugal", "POR"), awayTeam: t("Ouzbékistan", "UZB"),
    kickoffDate: "Mardi 23 juin", kickoffTime: "19:00",
    venue: "NRG Stadium, Houston", status: "scheduled",
  },
  {
    id: "g-046", stage: "GROUP", group: "L",
    homeTeam: t("Angleterre", "ENG"), awayTeam: t("Ghana", "GHA"),
    kickoffDate: "Mardi 23 juin", kickoffTime: "22:00",
    venue: "Gillette Stadium, Foxborough", status: "scheduled",
  },
  {
    id: "g-047", stage: "GROUP", group: "L",
    homeTeam: t("Panama", "PAN"), awayTeam: t("Croatie", "CRO"),
    kickoffDate: "Mercredi 24 juin", kickoffTime: "01:00",
    venue: "BMO Field, Toronto", status: "scheduled",
  },
  {
    id: "g-048", stage: "GROUP", group: "K",
    homeTeam: t("Colombie", "COL"), awayTeam: t("RD Congo", "COD"),
    kickoffDate: "Mercredi 24 juin", kickoffTime: "04:00",
    venue: "Estadio Akron, Zapopan", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // MERCREDI 24 JUIN — 3e journée (matchs simultanés)
  // ═══════════════════════════════════════════
  {
    id: "g-049", stage: "GROUP", group: "B",
    homeTeam: t("Suisse", "SUI"), awayTeam: t("Canada", "CAN"),
    kickoffDate: "Mercredi 24 juin", kickoffTime: "21:00",
    venue: "BC Place, Vancouver", status: "scheduled",
  },
  {
    id: "g-050", stage: "GROUP", group: "B",
    homeTeam: t("Bosnie", "BIH"), awayTeam: t("Qatar", "QAT"),
    kickoffDate: "Mercredi 24 juin", kickoffTime: "21:00",
    venue: "Lumen Field, Seattle", status: "scheduled",
  },
  {
    id: "g-051", stage: "GROUP", group: "C",
    homeTeam: t("Écosse", "SCO"), awayTeam: t("Brésil", "BRA"),
    kickoffDate: "Jeudi 25 juin", kickoffTime: "00:00",
    venue: "Hard Rock Stadium, Miami Gardens", status: "scheduled",
  },
  {
    id: "g-052", stage: "GROUP", group: "C",
    homeTeam: t("Maroc", "MAR"), awayTeam: t("Haïti", "HAI"),
    kickoffDate: "Jeudi 25 juin", kickoffTime: "00:00",
    venue: "Mercedes-Benz Stadium, Atlanta", status: "scheduled",
  },
  {
    id: "g-053", stage: "GROUP", group: "A",
    homeTeam: t("Tchéquie", "CZE"), awayTeam: t("Mexique", "MEX"),
    kickoffDate: "Jeudi 25 juin", kickoffTime: "03:00",
    venue: "Estadio Azteca, Mexico", status: "scheduled",
  },
  {
    id: "g-054", stage: "GROUP", group: "A",
    homeTeam: t("Afrique du Sud", "RSA"), awayTeam: t("Corée du Sud", "KOR"),
    kickoffDate: "Jeudi 25 juin", kickoffTime: "03:00",
    venue: "Estadio BBVA, Monterrey", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // JEUDI 25 JUIN — 3e journée
  // ═══════════════════════════════════════════
  {
    id: "g-055", stage: "GROUP", group: "E",
    homeTeam: t("Curaçao", "CUW"), awayTeam: t("Côte d'Ivoire", "CIV"),
    kickoffDate: "Jeudi 25 juin", kickoffTime: "22:00",
    venue: "Lincoln Financial Field, Philadelphia", status: "scheduled",
  },
  {
    id: "g-056", stage: "GROUP", group: "E",
    homeTeam: t("Équateur", "ECU"), awayTeam: t("Allemagne", "GER"),
    kickoffDate: "Jeudi 25 juin", kickoffTime: "22:00",
    venue: "MetLife Stadium, East Rutherford", status: "scheduled",
  },
  {
    id: "g-057", stage: "GROUP", group: "F",
    homeTeam: t("Japon", "JPN"), awayTeam: t("Suède", "SWE"),
    kickoffDate: "Vendredi 26 juin", kickoffTime: "01:00",
    venue: "AT&T Stadium, Arlington", status: "scheduled",
  },
  {
    id: "g-058", stage: "GROUP", group: "F",
    homeTeam: t("Tunisie", "TUN"), awayTeam: t("Pays-Bas", "NED"),
    kickoffDate: "Vendredi 26 juin", kickoffTime: "01:00",
    venue: "Arrowhead Stadium, Kansas City", status: "scheduled",
  },
  {
    id: "g-059", stage: "GROUP", group: "D",
    homeTeam: t("Türkiye", "TUR"), awayTeam: t("États-Unis", "USA"),
    kickoffDate: "Vendredi 26 juin", kickoffTime: "04:00",
    venue: "SoFi Stadium, Inglewood", status: "scheduled",
  },
  {
    id: "g-060", stage: "GROUP", group: "D",
    homeTeam: t("Paraguay", "PAR"), awayTeam: t("Australie", "AUS"),
    kickoffDate: "Vendredi 26 juin", kickoffTime: "04:00",
    venue: "Levi's Stadium, Santa Clara", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // VENDREDI 26 JUIN — 3e journée
  // ═══════════════════════════════════════════
  {
    id: "g-061", stage: "GROUP", group: "I",
    homeTeam: t("Norvège", "NOR"), awayTeam: t("France", "FRA"),
    kickoffDate: "Vendredi 26 juin", kickoffTime: "21:00",
    venue: "Gillette Stadium, Foxborough", status: "scheduled",
  },
  {
    id: "g-062", stage: "GROUP", group: "I",
    homeTeam: t("Sénégal", "SEN"), awayTeam: t("Irak", "IRQ"),
    kickoffDate: "Vendredi 26 juin", kickoffTime: "21:00",
    venue: "BMO Field, Toronto", status: "scheduled",
  },
  {
    id: "g-063", stage: "GROUP", group: "H",
    homeTeam: t("Cap-Vert", "CPV"), awayTeam: t("Arabie saoudite", "KSA"),
    kickoffDate: "Samedi 27 juin", kickoffTime: "02:00",
    venue: "NRG Stadium, Houston", status: "scheduled",
  },
  {
    id: "g-064", stage: "GROUP", group: "H",
    homeTeam: t("Uruguay", "URU"), awayTeam: t("Espagne", "ESP"),
    kickoffDate: "Samedi 27 juin", kickoffTime: "02:00",
    venue: "Estadio Akron, Zapopan", status: "scheduled",
  },
  {
    id: "g-065", stage: "GROUP", group: "G",
    homeTeam: t("Égypte", "EGY"), awayTeam: t("Iran", "IRN"),
    kickoffDate: "Samedi 27 juin", kickoffTime: "05:00",
    venue: "Lumen Field, Seattle", status: "scheduled",
  },
  {
    id: "g-066", stage: "GROUP", group: "G",
    homeTeam: t("Nouvelle-Zélande", "NZL"), awayTeam: t("Belgique", "BEL"),
    kickoffDate: "Samedi 27 juin", kickoffTime: "05:00",
    venue: "BC Place, Vancouver", status: "scheduled",
  },

  // ═══════════════════════════════════════════
  // SAMEDI 27 JUIN — 3e journée (fin)
  // ═══════════════════════════════════════════
  {
    id: "g-067", stage: "GROUP", group: "L",
    homeTeam: t("Panama", "PAN"), awayTeam: t("Angleterre", "ENG"),
    kickoffDate: "Samedi 27 juin", kickoffTime: "23:00",
    venue: "MetLife Stadium, East Rutherford", status: "scheduled",
  },
  {
    id: "g-068", stage: "GROUP", group: "L",
    homeTeam: t("Croatie", "CRO"), awayTeam: t("Ghana", "GHA"),
    kickoffDate: "Samedi 27 juin", kickoffTime: "23:00",
    venue: "Lincoln Financial Field, Philadelphia", status: "scheduled",
  },
  {
    id: "g-069", stage: "GROUP", group: "K",
    homeTeam: t("Colombie", "COL"), awayTeam: t("Portugal", "POR"),
    kickoffDate: "Dimanche 28 juin", kickoffTime: "01:30",
    venue: "Hard Rock Stadium, Miami Gardens", status: "scheduled",
  },
  {
    id: "g-070", stage: "GROUP", group: "K",
    homeTeam: t("RD Congo", "COD"), awayTeam: t("Ouzbékistan", "UZB"),
    kickoffDate: "Dimanche 28 juin", kickoffTime: "01:30",
    venue: "Mercedes-Benz Stadium, Atlanta", status: "scheduled",
  },
  {
    id: "g-071", stage: "GROUP", group: "J",
    homeTeam: t("Algérie", "ALG"), awayTeam: t("Autriche", "AUT"),
    kickoffDate: "Dimanche 28 juin", kickoffTime: "04:00",
    venue: "Arrowhead Stadium, Kansas City", status: "scheduled",
  },
  {
    id: "g-072", stage: "GROUP", group: "J",
    homeTeam: t("Jordanie", "JOR"), awayTeam: t("Argentine", "ARG"),
    kickoffDate: "Dimanche 28 juin", kickoffTime: "04:00",
    venue: "AT&T Stadium, Arlington", status: "scheduled",
  },
]

// ============================================
// ROUND OF 32 — 16 matchs (CDM 2026)
// Équipes à déterminer (Placeholders)
// ============================================
// ============================================
// MATCHS KO — Placeholders en attendant l'API
// Quand l'API remplira homeTeam/awayTeam, les cartes deviendront pronosticables
// ============================================

// Helper pour matchs KO sans équipes connues
const ko = (
  id: string,
  stage: FakeStage,
  homePlaceholder: string,
  awayPlaceholder: string,
  kickoffDate: string,
  kickoffTime: string,
  venue: string
): FakeMatchDetailed => ({
  id,
  stage,
  homePlaceholder,
  awayPlaceholder,
  homeTeam: null,
  awayTeam: null,
  kickoffDate,
  kickoffTime,
  venue,
  status: "scheduled",
})

// 1/16e de finale — 16 matchs (28 juin → 3 juillet 2026)
export const fakeRound32Matches: FakeMatchDetailed[] = [
  ko("r32-73", "ROUND_32", "2e Groupe A", "2e Groupe B", "Dimanche 28 juin", "21:00", "SoFi Stadium, Inglewood"),
  ko("r32-76", "ROUND_32", "1er Groupe C", "2e Groupe F", "Lundi 29 juin", "19:00", "NRG Stadium, Houston"),
  ko("r32-74", "ROUND_32", "1er Groupe E", "3e A/B/C/D/F", "Lundi 29 juin", "22:30", "Gillette Stadium, Foxborough"),
  ko("r32-75", "ROUND_32", "1er Groupe F", "2e Groupe C", "Mardi 30 juin", "03:00", "Estadio BBVA, Monterrey"),
  ko("r32-78", "ROUND_32", "2e Groupe E", "2e Groupe I", "Mardi 30 juin", "19:00", "AT&T Stadium, Arlington"),
  ko("r32-77", "ROUND_32", "1er Groupe I", "3e C/D/F/G/H", "Mardi 30 juin", "23:00", "MetLife Stadium, East Rutherford"),
  ko("r32-79", "ROUND_32", "1er Groupe A", "3e C/E/F/H/I", "Mercredi 1 juillet", "03:00", "Estadio Azteca, Mexico"),
  ko("r32-80", "ROUND_32", "1er Groupe L", "3e E/H/I/J/K", "Mercredi 1 juillet", "18:00", "Mercedes-Benz Stadium, Atlanta"),
  ko("r32-82", "ROUND_32", "1er Groupe G", "3e A/E/H/I/J", "Mercredi 1 juillet", "22:00", "Lumen Field, Seattle"),
  ko("r32-81", "ROUND_32", "1er Groupe D", "3e B/E/F/I/J", "Jeudi 2 juillet", "02:00", "Levi's Stadium, Santa Clara"),
  ko("r32-84", "ROUND_32", "1er Groupe H", "2e Groupe J", "Jeudi 2 juillet", "21:00", "SoFi Stadium, Inglewood"),
  ko("r32-83", "ROUND_32", "2e Groupe K", "2e Groupe L", "Vendredi 3 juillet", "01:00", "BMO Field, Toronto"),
  ko("r32-85", "ROUND_32", "1er Groupe B", "3e E/F/G/I/J", "Vendredi 3 juillet", "05:00", "BC Place, Vancouver"),
  ko("r32-88", "ROUND_32", "2e Groupe D", "2e Groupe G", "Vendredi 3 juillet", "20:00", "AT&T Stadium, Arlington"),
  ko("r32-86", "ROUND_32", "1er Groupe J", "2e Groupe H", "Samedi 4 juillet", "00:00", "Hard Rock Stadium, Miami Gardens"),
  ko("r32-87", "ROUND_32", "1er Groupe K", "3e D/E/I/J/L", "Samedi 4 juillet", "03:30", "Arrowhead Stadium, Kansas City"),
]

// 1/8e — 8 matchs (4-7 juillet)
export const fakeRound16Matches: FakeMatchDetailed[] = [
  ko("r16-90", "ROUND_16", "V. M73", "V. M75", "Samedi 4 juillet", "19:00", "NRG Stadium, Houston"),
  ko("r16-89", "ROUND_16", "V. M74", "V. M77", "Samedi 4 juillet", "23:00", "Lincoln Financial Field, Philadelphia"),
  ko("r16-91", "ROUND_16", "V. M76", "V. M78", "Dimanche 5 juillet", "22:00", "MetLife Stadium, East Rutherford"),
  ko("r16-92", "ROUND_16", "V. M79", "V. M80", "Lundi 6 juillet", "02:00", "Estadio Azteca, Mexico"),
  ko("r16-93", "ROUND_16", "V. M83", "V. M84", "Lundi 6 juillet", "21:00", "AT&T Stadium, Arlington"),
  ko("r16-94", "ROUND_16", "V. M81", "V. M82", "Mardi 7 juillet", "02:00", "Lumen Field, Seattle"),
  ko("r16-95", "ROUND_16", "V. M86", "V. M88", "Mardi 7 juillet", "18:00", "Mercedes-Benz Stadium, Atlanta"),
  ko("r16-96", "ROUND_16", "V. M85", "V. M87", "Mardi 7 juillet", "22:00", "BC Place, Vancouver"),
]

// Quarts — 4 matchs (9-11 juillet)
export const fakeQuarterMatches: FakeMatchDetailed[] = [
  ko("qf-97", "QUARTER", "V. M89", "V. M90", "Jeudi 9 juillet", "22:00", "Gillette Stadium, Foxborough"),
  ko("qf-98", "QUARTER", "V. M93", "V. M94", "Vendredi 10 juillet", "21:00", "SoFi Stadium, Inglewood"),
  ko("qf-99", "QUARTER", "V. M91", "V. M92", "Samedi 11 juillet", "23:00", "Hard Rock Stadium, Miami Gardens"),
  ko("qf-100", "QUARTER", "V. M95", "V. M96", "Dimanche 12 juillet", "03:00", "Arrowhead Stadium, Kansas City"),
]

// Demis — 2 matchs (14-15 juillet)
export const fakeSemiMatches: FakeMatchDetailed[] = [
  ko("sf-101", "SEMI", "V. M97", "V. M98", "Mardi 14 juillet", "21:00", "AT&T Stadium, Arlington"),
  ko("sf-102", "SEMI", "V. M99", "V. M100", "Mercredi 15 juillet", "21:00", "Mercedes-Benz Stadium, Atlanta"),
]

// Petite finale — 1 match (18 juillet)
export const fakeThirdPlaceMatches: FakeMatchDetailed[] = [
  ko("3p-103", "THIRD_PLACE", "P. M101", "P. M102", "Samedi 18 juillet", "23:00", "Hard Rock Stadium, Miami Gardens"),
]

// Finale — 1 match (19 juillet)
export const fakeFinalMatches: FakeMatchDetailed[] = [
  ko("f-104", "FINAL", "V. M101", "V. M102", "Dimanche 19 juillet", "21:00", "MetLife Stadium, East Rutherford"),
]

// ============================================
// FIN DU FICHIER : HELPERS & CONSTANTES
// ============================================

export const fakeGroupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export type FakeStageInfo = {
  key: FakeStage;
  label: string;
  status: "past" | "current" | "future";
  matchesCount: number;
};

export const fakeStages: FakeStageInfo[] = [
  { key: "GROUP", label: "Phase de poules", status: "current", matchesCount: 72 },
  { key: "ROUND_32", label: "1/16e de finale", status: "future", matchesCount: 16 },
  { key: "ROUND_16", label: "1/8e de finale", status: "future", matchesCount: 8 },
  { key: "QUARTER", label: "Quarts", status: "future", matchesCount: 4 },
  { key: "SEMI", label: "Demi-finales", status: "future", matchesCount: 2 },
  { key: "THIRD_PLACE", label: "Petite finale", status: "future", matchesCount: 1 },
  { key: "FINAL", label: "Finale", status: "future", matchesCount: 1 },
];

export function getMatchesByStage(stage: FakeStage): FakeMatchDetailed[] {
  switch (stage) {
    case "GROUP":
      return fakeGroupMatches
    case "ROUND_32":
      return fakeRound32Matches
    case "ROUND_16":
      return fakeRound16Matches
    case "QUARTER":
      return fakeQuarterMatches
    case "SEMI":
      return fakeSemiMatches
    case "THIRD_PLACE":
      return fakeThirdPlaceMatches
    case "FINAL":
      return fakeFinalMatches
    default:
      return []
  }
}

