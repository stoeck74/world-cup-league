import { auth } from "@/../auth"
import Link from "next/link"
import {
  ArrowRight,
  Trophy,
  ListNumbers,
  CheckCircle,
  Lightning,
  CalendarBlank,
  Globe,
  Target,
  ChartLine,
  House,
  Users,
  UserCircleDashed,
  } from "@phosphor-icons/react/dist/ssr"

export default async function AidePage() {
  const session = await auth()
  if (!session) return null

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-aide">
      <div className="max-w-[1400px] mx-auto">

        {/* ============================================
            HEADER
            ============================================ */}
        <header className="mb-12 md:mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
            World Cup League
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight leading-tight">
            Bienvenue <span className="text-accent">{session.user.username}</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg mt-4 max-w-2xl mx-auto">
            Tu viens de rejoindre la League. Voici tout ce qu&apos;il faut savoir
            pour ne rien rater du Mondial 2026.
          </p>
        </header>

        {/* ============================================
            SECTION 1 — Le jeu en 3 étapes
            ============================================ */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Le concept
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Le jeu en <span className="text-accent">3 étapes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StepCard
              number="01"
              icon={<Target size={24} weight="bold" className="text-accent" />}
              title="Pronostique"
              description="Compose ton pronostic avant le coup d'envoi de chaque match."
            />
            <StepCard
              number="02"
              icon={<ChartLine size={24} weight="bold" className="text-accent" />}
              title="Compare"
              description="Plus tu pronostiques juste, plus tu marques de points. Suis ton ascension dans le classement de la League."
            />
            <StepCard
              number="03"
              icon={<Trophy size={24} weight="bold" className="text-accent" />}
              title="Triomphe"
              description="À la fin de la Coupe du Monde, le joueur en tête de la League gagne… la gloire éternelle entre potes."
            />
          </div>
        </section>

        {/* ============================================
            SECTION 2 — Le barème des points
            ============================================ */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Le barème
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Comment <span className="text-accent">marquer</span> ?
            </h2>
          </div>

          <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 overflow-hidden">
            <ScoreRow
              points={0}
              label="Mauvais résultat"
              description="Tu as tout faux ! Ni le vainqueur, ni le score. Zéro point."
              variant="zero"
            />
            <ScoreRow
              points={1}
              label="Bon résultat"
              description="Tu as trouvé le bon vainqueur (ou un match nul), mais pas le score exact."
              variant="one"
            />
            <ScoreRow
              points={3}
              label="Score exact"
              description="Tu as trouvé le bon score ! Bingo +3."
              variant="three"
              isLast
            />
          </div>
        </section>

        {/* ============================================
            SECTION 3 — Le calendrier
            ============================================ */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Le calendrier
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Du <span className="text-accent">11 juin</span> au{" "}
              <span className="text-accent">19 juillet 2026</span>
            </h2>
          </div>

          <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <PhaseInfo dates="11 → 27 juin" name="Phase de poules" detail="72 matchs · 12 groupes de 4" />
              <PhaseInfo dates="28 juin → 3 juillet" name="1/16e de finale" detail="16 matchs (nouveauté 2026)" />
              <PhaseInfo dates="4 → 7 juillet" name="1/8e de finale" detail="8 matchs" />
              <PhaseInfo dates="9 → 11 juillet" name="Quarts de finale" detail="4 matchs" />
              <PhaseInfo dates="14 → 15 juillet" name="Demi-finales" detail="2 matchs" />
              <PhaseInfo dates="18 juillet" name="Petite finale" detail="3e place" />
              <PhaseInfo dates="19 juillet" name="Finale" detail="Au MetLife Stadium 🏆" highlight />
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3 text-text-secondary text-sm">
              <Globe size={16} className="text-text-muted" />
              <span>48 nations · 104 matchs · 16 stades aux États-Unis, Canada et Mexique</span>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 4 — Les sections du site
            ============================================ */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Le site
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Où trouver <span className="text-accent">quoi</span> ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SectionCard
              href="/dashboard"
              icon={<House size={20} weight="bold" className="text-accent" />}
              title="Tableau de bord"
              description="Ton dashboard perso : ton rang, tes stats, les prochains matchs à pronostiquer."
            />
            <SectionCard
              href="/matchs"
              icon={<Target size={20} weight="bold" className="text-accent" />}
              title="Matchs"
              description="Pronostique les 72 matchs des poules et le tableau final."
            />
            <SectionCard
              href="/classement"
              icon={<Trophy size={20} weight="bold" className="text-accent" />}
              title="Classement"
              description="Le classement de la League. Vise le top du podium."
            />
            <SectionCard
              href="/resultats"
              icon={<ListNumbers size={20} weight="bold" className="text-accent" />}
              title="Résultats"
              description="Les classements officiels des groupes du Mondial."
            />
            <SectionCard
              href="/joueurs"
              icon={<Users size={20} weight="bold" className="text-accent" />}
              title="Joueurs"
              description="L'annuaire de la League. Découvre les profils de tes adversaires."
            />
            <SectionCard
              href={`/joueurs/${session.user.username}`}
              icon={<Lightning size={20} weight="bold" className="text-accent" />}
              title="Mon profil"
              description="Personnalise ton avatar, ton équipe favorite et ton MVP du tournoi."
            />
          </div>
        </section>

        {/* ============================================
            SECTION 5 — Bonus
            ============================================ */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Bon à savoir
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Quelques <span className="text-accent">détails</span>
            </h2>
          </div>

          <div className="space-y-3">
            <BulletInfo
              icon={<UserCircleDashed size={24} weight="bold" />}
              text="Pense a personnaliser ton profil, c'est plus fun pour tout le monde !"
            />
            <BulletInfo
              icon={<CalendarBlank size={24} weight="bold" />}
              text="Tu peux modifier ton pronostic jusqu'au coup d'envoi du match. Après, c'est verrouillé."
            />
            <BulletInfo
              icon={<Target size={24} weight="bold" />}
              text="Pour les matchs à élimination directe, tu pronostiques au fur et à mesure que les qualifiés sont connus."
            />
            <BulletInfo
              icon={<Users size={24} weight="bold" />}
              text="Le code d'invitation de la League est partageable, mais essaie de garder ça entre potes."
            />
          </div>
        </section>

        {/* ============================================
            CTA Final
            ============================================ */}
        <div className="text-center pt-8 pb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 bg-accent text-bg px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-hover transition-colors group"
          >
            Entrer dans la League
            <ArrowRight
              size={22}
              weight="bold"
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <p className="text-text-muted text-xs mt-4">
            Tu peux revenir sur cette page à tout moment depuis le menu
          </p>
        </div>

      </div>
    </div>
  )
}

// ============================================
// SOUS-COMPOSANTS
// ============================================

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-6 md:p-7">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-black text-text-muted/40 tabular-nums">{number}</span>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  )
}

function ScoreRow({
  points,
  label,
  description,
  variant,
  isLast = false,
}: {
  points: 0 | 1 | 3
  label: string
  description: string
  variant: "zero" | "one" | "three"
  isLast?: boolean
}) {
  const colorClass =
    variant === "three"
      ? "text-accent"
      : variant === "one"
      ? "text-text-primary"
      : "text-text-muted"

  return (
    <div className={`flex items-center gap-5 px-6 py-5 ${!isLast ? "border-b border-white/5" : ""}`}>
      <div className="shrink-0 w-16 text-center">
        <span className={`text-4xl md:text-5xl font-black tabular-nums ${colorClass}`}>
          +{points}
        </span>
        <p className="text-[10px] uppercase tracking-widest text-text-muted mt-0.5">pts</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold text-text-primary mb-1">{label}</p>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function PhaseInfo({
  dates,
  name,
  detail,
  highlight = false,
}: {
  dates: string
  name: string
  detail: string
  highlight?: boolean
}) {
  return (
    <div className={`flex items-start gap-3 ${highlight ? "" : ""}`}>
      <CheckCircle
        size={18}
        weight={highlight ? "fill" : "regular"}
        className={highlight ? "text-accent shrink-0 mt-0.5" : "text-text-muted shrink-0 mt-0.5"}
      />
      <div className="min-w-0">
        <p className={`font-semibold ${highlight ? "text-accent" : "text-text-primary"}`}>
          {name}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          {dates} · {detail}
        </p>
      </div>
    </div>
  )
}

function SectionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 hover:border-white/20 p-5 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-base font-bold text-text-primary flex-1">{title}</h3>
        <ArrowRight
          size={14}
          weight="bold"
          className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
    </Link>
  )
}

function BulletInfo({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/5">
      <span className="text-accent shrink-0 mt-0.5">{icon}</span>
      <p className="text-sm text-text-secondary leading-relaxed">{text}</p>
    </div>
  )
}