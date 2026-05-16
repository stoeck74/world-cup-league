import { auth } from "@/../auth"
import { prisma } from "@/lib/prisma"
import { getUserPastPredictions, getUserUpcomingPredictions } from "@/lib/dashboard-data"
import { notFound } from "next/navigation"
import { Pencil, Trophy, Lightning, Target } from "@phosphor-icons/react/dist/ssr"
import { EditableField } from "@/components/profile/EditableField"
import { updateFavoritePlayer } from "@/lib/actions/profile"
import { ProfileFavoritePlayer } from "@/components/profile/ProfileFavoritePlayer"
import { ProfileFavoriteTeam } from "@/components/profile/ProfileFavoriteTeam"
import { ProfileAvatar } from "@/components/profile/ProfileAvatar"
import { ProfileSecurityForm } from "@/components/profile/ProfileSecurityForm"
import { getUserGoldenBootPredictions } from "@/lib/actions/golden-boot"
import { ProfileGoldenBoot } from "@/components/profile/ProfileGoldenBoot"


// ============================================
// TYPES
// ============================================

type ProfilePageProps = {
  params: Promise<{ username: string }>
}

// ============================================
// PAGE
// ============================================

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const session = await auth()

  if (!session) return null

  // Récupère le profil du user demandé (avec ses relations)
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    include: {
      favoriteTeam: true,
    },
  })

  if (!user) {
    notFound()
  }
    const isOwnProfile = session.user.username.toLowerCase() === username.toLowerCase()
  // Pronos passés (visibles par tous)
  const pastPredictions = await getUserPastPredictions(user.id)

  // Pronos en cours (visibles uniquement sur son propre profil)
  const upcomingPredictions = isOwnProfile
    ? await getUserUpcomingPredictions(user.id)
    : []
    // Pronos Soulier d'Or (visibles par tous)
  const goldenBootPredictions = await getUserGoldenBootPredictions(username)
  // Récupérer les 18 équipes pour le dropdown (uniquement si c'est ton profil)
const allTeams = await prisma.team.findMany({
  orderBy: { shortName: "asc" },
  
  select: {
    id: true,
    name: true,
    shortName: true,
    tla: true,
    crestUrl: true,
  },
})

  // Détecte si c'est ton propre profil


  // Classe CSS pour l'image de fond équipe
  const teamBgClass = user.favoriteTeam?.tla?.toLowerCase().trim() ?? ""

  
  // Date d'inscription formatée en FR
  const memberSince = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt))

  // ============================================
  // STATS — Placeholder pour V1
  // ============================================
  const stats = {
    position: "3e",
    totalPlayers: 8,
    predictionsMade: 24,
    bestScore: 6,
    bestMatchday: 18,
  }

  return (
    
<div className={`relative bg-user ${teamBgClass} h-full p-6 md:p-10 lg:p-16 overflow-hidden`}>

      {/* ============================================
          HALOS DÉCORATIFS
          ============================================ */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[140px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* ============================================
          CONTENU — Card 50% gauche desktop, fullwidth mobile
          ============================================ */}
<div className="relative">
  <div className="w-full md:max-w-[50%]">

          {/* ============================================
              EN-TÊTE — Avatar + Pseudo + Membre depuis
              ============================================ */}
          <header className="mb-10 md:mb-12">
            <div className="flex items-center gap-6 mb-4">
              {/* Avatar */}
              <ProfileAvatar
                initialStyle={user.avatarStyle}
                initialSeed={user.avatarSeed}
                username={user.username}
                isOwnProfile={isOwnProfile}
              />

              {/* Pseudo + Membre depuis */}
              <div className="min-w-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-none">
                  {user.username}
                </h1>
                <p className="text-xs md:text-sm uppercase tracking-widest text-text-muted mt-3">
                  Membre depuis {memberSince}
                </p>
              </div>
            </div>
            {isOwnProfile && <ProfileSecurityForm />}
          </header>

          {/* ============================================
              SECTION IDENTITÉ — Équipe + Joueur favori
              ============================================ */}
          <section className="mb-10 md:mb-12 space-y-4">

          <ProfileFavoriteTeam
  teams={allTeams}
  currentTeamId={user.favoriteTeamId}
  isOwnProfile={isOwnProfile}
/>

{/* Joueur favori */}
<ProfileFavoritePlayer
  initialValue={user.favoritePlayer}
  isOwnProfile={isOwnProfile}
/>

          </section>

          {/* ============================================
              SECTION STATS — 3 chiffres identitaires
              ============================================ */}
          <section className="grid grid-cols-3 gap-3 md:gap-4">

            {/* Position */}
            <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={14} weight="bold" className="text-accent" />
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-text-muted">
                  Position
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-black text-text-primary">
                {stats.position}
                <span className="text-text-muted text-sm font-normal ml-1">
                  / {stats.totalPlayers}
                </span>
              </p>
            </div>

            {/* Pronos faits */}
            <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightning size={14} weight="bold" className="text-accent" />
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-text-muted">
                  Pronos
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-black text-text-primary">
                {stats.predictionsMade}
              </p>
            </div>

            {/* Meilleur prono */}
            <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} weight="bold" className="text-accent" />
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-text-muted">
                  Meilleur
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-black text-accent">
                +{stats.bestScore}
                <span className="text-text-muted text-sm font-normal ml-1">
                  J{stats.bestMatchday}
                </span>
              </p>
            </div>

</section>

<section className="py-12">
{goldenBootPredictions.ok && goldenBootPredictions.predictions && (
  <ProfileGoldenBoot
    picks={{
      first: goldenBootPredictions.predictions.first,
      second: goldenBootPredictions.predictions.second,
      third: goldenBootPredictions.predictions.third,
    }}
  />
)}
</section>
          {/* ============================================
              PRONOS PASSÉS
              ============================================ */}
{/* ============================================
              PRONOS EN COURS — Visible uniquement sur son propre profil
              ============================================ */}
          {isOwnProfile && (
            <section className="mt-8 md:mt-10">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                  À venir
                </p>
                <h2 className="text-xl font-bold text-text-primary">
                  Mes pronos en cours
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Visibles uniquement par toi tant que le match n&apos;est pas joué
                </p>
              </div>

              <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 overflow-hidden">
                {upcomingPredictions.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-text-muted text-center">
                    Aucun prono enregistré pour les matchs à venir
                  </p>
                ) : (
                  upcomingPredictions.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 px-4 py-3 border-b border-white/5 last:border-b-0"
                    >
                                            {/* Date */}
                      <div className="text-xs text-text-muted text-right shrink-0 hidden sm:block">
                        <p>{p.kickoffDate}</p>
                        <p className="text-text-secondary font-medium">{p.kickoffTime}</p>
                      </div>
{/* Équipes avec crests */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {p.homeTeamCrest && (
                          <img
                            src={p.homeTeamCrest}
                            alt={p.homeTeamTla}
                            className="w-6 h-6 shrink-0 object-contain"
                          />
                        )}
                        <span className="text-sm font-medium text-text-secondary truncate">
                          {p.homeTeamName}
                        </span>
                        <span className="text-text-muted text-xs">vs</span>
                        <span className="text-sm font-medium text-text-secondary truncate">
                          {p.awayTeamName}
                        </span>
                        {p.awayTeamCrest && (
                          <img
                            src={p.awayTeamCrest}
                            alt={p.awayTeamTla}
                            className="w-6 h-6 shrink-0 object-contain"
                          />
                        )}
                      </div>

                      {/* Mon prono */}
                      <div className="text-sm font-bold text-accent shrink-0">
                        {p.myHomePrediction}-{p.myAwayPrediction}
                        {p.myQualifierTla && (
                          <span className="text-text-muted text-xs ml-1">
                            ★ {p.myQualifierTla}
                          </span>
                        )}
                      </div>


                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* ============================================
              PRONOS PASSÉS — Visibles par tous
              ============================================ */}
          <section className="mt-8 md:mt-10">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                Historique
              </p>
              <h2 className="text-xl font-bold text-text-primary">
                {isOwnProfile ? "Mes pronos passés" : `Pronos passés de ${user.username}`}
              </h2>
            </div>

            <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 overflow-hidden">
              {pastPredictions.length === 0 ? (
                <p className="px-4 py-6 text-sm text-text-muted text-center">
                  {isOwnProfile
                    ? "Tu n'as pas encore de pronos sur des matchs joués"
                    : "Aucun prono passé pour l'instant"}
                </p>
              ) : (
                pastPredictions.map((p, idx) => (
                  <div
                    key={idx}
                    className={`
                      flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0
                      ${p.result === "exact"
                        ? "bg-green-500/10"
                        : p.result === "good"
                        ? "bg-accent/10"
                        : ""
                      }
                    `}
                  >
                    {/* Score réel avec crests */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {p.homeTeamCrest ? (
                        <img
                          src={p.homeTeamCrest}
                          alt={p.homeTeamTla}
                          className="w-6 h-6 shrink-0 object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold uppercase text-text-muted shrink-0 w-6">
                          {p.homeTeamTla}
                        </span>
                      )}
                      <span className="text-sm font-bold text-text-primary tabular-nums">
                        {p.homeScore}
                      </span>
                      <span className="text-text-muted">-</span>
                      <span className="text-sm font-bold text-text-primary tabular-nums">
                        {p.awayScore}
                      </span>
                      {p.awayTeamCrest ? (
                        <img
                          src={p.awayTeamCrest}
                          alt={p.awayTeamTla}
                          className="w-6 h-6 shrink-0 object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold uppercase text-text-muted shrink-0 w-6">
                          {p.awayTeamTla}
                        </span>
                      )}
                    </div>

                    {/* Mon prono */}
                    <div className="text-xs text-text-muted shrink-0">
                      prono{" "}
                      <span className="text-text-secondary font-medium">
                        {p.myHomePrediction}-{p.myAwayPrediction}
                      </span>
                    </div>

                    {/* Points obtenus */}
                    <div className={`
                      text-sm font-bold w-12 text-right shrink-0
                      ${p.result === "exact"
                        ? "text-green-400"
                        : p.result === "good"
                        ? "text-accent"
                        : "text-text-muted"
                      }
                    `}>
                      {p.points > 0 ? `+${p.points}` : "0"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>

    </div>
  )
}