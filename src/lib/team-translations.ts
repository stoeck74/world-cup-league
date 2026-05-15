// ============================================
// MAP DE TRADUCTION ANGLAIS → FRANÇAIS
// Pour les noms d'équipes de la CDM 2026
// ============================================
// Utilisé au moment de la sync API → DB.
// Si une équipe n'est pas dans la map, on garde le nom anglais d'origine.

export const teamNameTranslations: Record<string, string> = {
  // Map des noms exacts retournés par football-data.org
  // Clé = nom anglais (tel quel dans l'API)
  // Valeur = nom français à stocker en DB

"Mexico": "Mexique",
"South Africa": "Afrique du Sud",
"Norway": "Norvège",
"Czechia": "Tchéquie",
"Canada": "Canada",
"Switzerland": "Suisse",
"Bosnia and Herzegovina": "Bosnie-Herzégovine",
"Qatar": "Qatar",
"Germany": "Allemagne",
"Tunisia": "Tunisie",
"New Zealand": "Nouvelle-Zélande",
"United States": "États-Unis",
"Turkey": "Turquie",
"Australia": "Australie",
"Paraguay": "Paraguay",
"France": "France",
"Senegal": "Sénégal",
"Congo DR": "RD Congo",
"Argentina": "Argentine",
"Egypt": "Égypte",
"Algeria": "Algérie",
"Curaçao": "Curaçao",
"England": "Angleterre",
"Croatia": "Croatie",
"Cameroon": "Cameroun",
"Cape Verde": "Cap-Vert",
"Spain": "Espagne",
"Belgium": "Belgique",
"Saudi Arabia": "Arabie Saoudite",
"Costa Rica": "Costa Rica",
"Brazil": "Brésil",
"Portugal": "Portugal",
"Morocco": "Maroc",
"Panama": "Panama",
"Netherlands": "Pays-Bas",
"Uruguay": "Uruguay",
"Japan": "Japon",
"Ghana": "Ghana",
"Colombia": "Colombie",
"Korea Republic": "Corée du Sud",
"Uzbekistan": "Ouzbékistan",
"Denmark": "Danemark",
"Ecuador": "Équateur",
"Austria": "Autriche",
"Jordan": "Jordanie",
"Sweden": "Suède",
"Iraq": "Irak",
"Scotland": "Écosse",
"Ivory Coast": "Côte d'Ivoire",
"iran": "Iran",
}

/**
 * Traduit le nom d'une équipe en français.
 * Si non trouvé, retourne le nom d'origine.
 */
export function translateTeamName(englishName: string): string {
  return teamNameTranslations[englishName] ?? englishName
}