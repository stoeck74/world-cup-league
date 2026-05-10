# World Cup League ⚽🏆

Le jeu de pronos **Coupe du Monde 2026** entre potes.

Adapté depuis [Panenka League](../panenka-league/) (Ligue 1) pour la compétition CDM 2026.

---

## ⚙️ Setup local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer `.env`

Crée un fichier `.env` à la racine (à partir d'un projet Neon **dédié à ce projet**) :

```
DATABASE_URL="postgres://...@..."
AUTH_SECRET="...."  # générer avec `openssl rand -base64 32`
FOOTBALL_DATA_API_KEY="...."  # https://www.football-data.org/account
```

### 3. Préparer la base

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed admin

```bash
npx tsx prisma/seed.ts
```

→ Crée un user `admin` avec password `test1234` et un code d'invitation `WCL-2026-TEST`.

### 5. Seed des 48 nations

```bash
npx tsx prisma/seed-teams.ts
```

→ Tente de récupérer les 48 nations qualifiées via l'API football-data.org (compétition `WC`, ID 2000).
   Si l'API échoue ou renvoie une liste vide, le script bascule sur un **fallback hardcodé** des 48 nations connues au 10 mai 2026.

→ Crée également l'objet `Tournament` "FIFA World Cup 2026" (11 juin → 19 juillet 2026).

### 6. Lancer le serveur

```bash
npm run dev
```

→ http://localhost:3000

---

## 🏗️ Structure adaptée depuis Panenka League

### ✅ Ce qui a été adapté automatiquement

| Élément | Avant (Ligue 1) | Après (CDM) |
|---|---|---|
| Nom projet | `panenka-league` | `world-cup-league` |
| Wordmark | PANENKA League | WORLD CUP League |
| Code invitation | `PANENKA-XXXX` | `WCL-2026-XXXX` |
| Schéma Prisma | `Season` + `Matchday` | `Tournament` + `MatchStage` (GROUP, ROUND_32, etc.) |
| Banco | 2 par journée | ❌ Supprimé |
| Slot machine landing | JOUE / SUIS / GAGNE | PRÉDIS / SOUTIENS / TRIOMPHE |
| CSS `.bg-user` | 18 clubs L1 | 48 nations CDM |
| `public/team/` | 18 fichiers L1 | À fournir : 48 fichiers nations |
| Fake data matchs | 38 journées L1 | Phases CDM (groupes + KO) |

### 🔧 Ce qui reste à styler/finaliser ensemble

1. **48 visuels nations** (`public/team/{tla}.webp`) — voir `public/team/README.md` pour la liste
2. **DashboardChart** — actuellement encore en mode 38 journées de Ligue 1 (placeholder).
   À refaire pour visualiser : phase de poules (3 matchs) puis chaque tour KO
3. **Composant `<GroupStage>`** — vue 12 mini-classements de 4 équipes (à créer)
4. **Composant `<KnockoutBracket>`** — arbre des matchs (à créer)
5. **Champ "qui passe ?"** sur les KO — schéma prêt (`qualifierTeamId` sur `Prediction`),
   composant `<MatchCard>` à enrichir
6. **Calcul des points** — server action et logique métier à créer
7. **Sync API real** — service `src/lib/football-data.ts` à créer pour récupérer matchs et scores

---

## 📋 Données du tournoi

- **Dates** : 11 juin → 19 juillet 2026
- **Hôtes** : Canada, Mexique, États-Unis
- **Format** : 48 nations, 12 groupes de 4, 104 matchs au total
  - Phase de poules : 72 matchs (3 par équipe)
  - Round of 32 : 16 matchs (nouveau cette édition)
  - Round of 16 : 8 matchs
  - Quarts : 4 matchs
  - Demis : 2 matchs
  - Petite finale : 1 match
  - Finale : 1 match

## 🎯 Règles du jeu (V1)

- **0 pt** : mauvais résultat (gagnant/perdant/nul faux)
- **1 pt** : bon résultat (gagnant/perdant/nul correct mais score faux)
- **3 pts** : score exact

Pour les KO :
- Si l'équipe que tu pronostiques comme qualifiée passe vraiment → bonus à définir
- Score 90 min reste l'unité de base

**Pas de banco** dans cette V1.

---

## 🗺️ Roadmap

### V1 (avant le 11 juin 2026)
- [x] Schéma Prisma + migration
- [x] Seed 48 nations + tournoi
- [x] Suppression du banco partout
- [x] Refactor MatchsView en phases
- [ ] **48 visuels nations** (à fournir par le owner)
- [ ] Page `/classement`
- [ ] Sync API matchs (groupes complets)
- [ ] Server actions pour sauvegarder pronos en base

### V1.5 (pendant les groupes, 11–27 juin)
- [ ] Calcul auto des points après chaque match
- [ ] Cron sync matchs/scores toutes les 5 min en jour de match

### V2 (avant les KO, 28 juin)
- [ ] Composant `<GroupStage>` avec mini-classements
- [ ] Composant `<KnockoutBracket>` (arbre)
- [ ] Champ "qui passe ?" sur les pronos KO
- [ ] DashboardChart refait pour la CDM
