"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { createPortal } from "react-dom"
import { gsap } from "gsap"
import { Trophy, X, MagnifyingGlass, SoccerBall } from "@phosphor-icons/react"
import {
  saveGoldenBootPredictions,
  searchPlayers,
} from "@/lib/actions/golden-boot"

type PlayerPick = {
  id: string
  name: string
  position: string | null
  nationality: string | null
  team: {
    name: string
    tla: string | null
    crestUrl: string | null
  }
}

type GoldenBootCardProps = {
  initialPicks: {
    first: PlayerPick | null
    second: PlayerPick | null
    third: PlayerPick | null
  }
  isLocked: boolean
}

// ============================================
// CARD PRINCIPALE
// ============================================
export function GoldenBootCard({ initialPicks, isLocked }: GoldenBootCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [picks, setPicks] = useState(initialPicks)

  const hasAnyPick = picks.first || picks.second || picks.third

  return (
    <>
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">

            <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">
              Meilleurs <span className="text-lime">Buteurs</span>
            </h3>
          </div>
          {isLocked && (
            <span className="text-[10px] uppercase tracking-widest text-text-muted">
              Verrouillé
            </span>
          )}
        </div>

        {/* Liste des 3 choix */}
        {hasAnyPick ? (
          <div className="space-y-2">
            <PickRow rank={1} pick={picks.first} />
            <PickRow rank={2} pick={picks.second} />
            <PickRow rank={3} pick={picks.third} />
          </div>
        ) : (
          <p className="text-sm text-text-muted py-2">Pas encore choisi</p>
        )}

        {/* Bouton */}
        {!isLocked && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {hasAnyPick ? "Modifier mes choix" : "Choisir mes 3 buteurs"}
          </button>
        )}

        {isLocked && !hasAnyPick && (
          <p className="mt-3 text-xs text-text-muted italic">
            Trop tard pour pronostiquer
          </p>
        )}

{/* Explication des règles */}
        <p className="mt-4 pt-4 border-t border-white/5 text-xs text-text-muted leading-relaxed">
          Pronostique le <span className="text-lime">top 3</span> des meilleurs buteurs du tournoi.
          <span className="text-lime"> +15 pts</span> par joueur dans le top 3,{" "}
          <span className="text-lime">+5 pts bonus </span> si il est à la bonne place.
        </p>
      </div>

      {/* MODAL */}
      {showModal && (
        <GoldenBootModal
          initialPicks={picks}
          onSave={(newPicks) => {
            setPicks(newPicks)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

// ============================================
// LIGNE D'UN CHOIX (1er, 2e, 3e) dans la card
// ============================================
function PickRow({ rank, pick }: { rank: 1 | 2 | 3; pick: PlayerPick | null }) {
  const rankLabel = rank === 1 ? "1er" : rank === 2 ? "2e" : "3e"
  const rankColor =
    rank === 1
      ? "text-lime"
      : rank === 2
      ? ""
      : "text-text-muted"

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 py-3 pl-3">
      <span className={`text-xs font-bold uppercase tracking-widest ${rankColor} shrink-0 w-6`}>
        {rankLabel}
      </span>

      {pick ? (
        <>
          {pick.team.crestUrl ? (
            <img
              src={pick.team.crestUrl}
              alt={pick.team.tla ?? ""}
              className="w-5 h-5 object-contain shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/10 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {pick.name}
            </p>

          </div>
        </>
      ) : (
        <p className="text-sm text-text-muted italic">—</p>
      )}
    </div>
  )
}

// ============================================
// MODAL DE SAISIE
// ============================================
function GoldenBootModal({
  initialPicks,
  onSave,
  onClose,
}: {
  initialPicks: GoldenBootCardProps["initialPicks"]
  onSave: (picks: GoldenBootCardProps["initialPicks"]) => void
  onClose: () => void
}) {
  const [first, setFirst] = useState<PlayerPick | null>(initialPicks.first)
  const [second, setSecond] = useState<PlayerPick | null>(initialPicks.second)
  const [third, setThird] = useState<PlayerPick | null>(initialPicks.third)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Animation GSAP d'entrée
  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return

    const tl = gsap.timeline()
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" }
    )
    tl.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.92, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.3)" },
      "-=0.1"
    )

    const inputs = modalRef.current.querySelectorAll("[data-pick-input]")
    tl.fromTo(
      inputs,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      },
      "-=0.2"
    )
  }, [])

  // ESC pour fermer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      const result = await saveGoldenBootPredictions(
        first?.id ?? null,
        second?.id ?? null,
        third?.id ?? null
      )
      if (result.ok) {
        onSave({ first, second, third })
      } else {
        setError(result.error ?? "Erreur inconnue")
      }
    })
  }

  const excludedIds = [first?.id, second?.id, third?.id].filter(Boolean) as string[]

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-2xl border border-accent/30 shadow-2xl shadow-accent/20 overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, #0a1929 0%, #142847 50%, #0a1929 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Halos décoratifs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Trophy size={20} weight="fill" className="text-accent" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Top 3 des meilleurs buteurs
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={22} weight="bold" />
          </button>
        </div>

        <p className="relative text-xs text-white/60 mb-6">
          Choisis 3 joueurs qui termineront en tête au classement des buteurs.
          <br />
          <span className="text-accent font-semibold">+30 pts</span> pour le 1er pile bon,{" "}
          <span className="text-accent font-semibold">+10/+5/+5</span> par buteur dans le top 3.
        </p>

        {/* 3 inputs */}
        <div className="relative space-y-4">
          <div data-pick-input>
            <PlayerInput
              rank={1}
              value={first}
              onChange={setFirst}
              excludedIds={excludedIds.filter((id) => id !== first?.id)}
            />
          </div>
          <div data-pick-input>
            <PlayerInput
              rank={2}
              value={second}
              onChange={setSecond}
              excludedIds={excludedIds.filter((id) => id !== second?.id)}
            />
          </div>
          <div data-pick-input>
            <PlayerInput
              rank={3}
              value={third}
              onChange={setThird}
              excludedIds={excludedIds.filter((id) => id !== third?.id)}
            />
          </div>
        </div>

        {error && (
          <p className="relative mt-4 text-sm text-red-300 bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="relative mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-bg text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {isPending ? "Sauvegarde..." : "Valider mes choix"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// INPUT AVEC AUTOCOMPLETE (dropdown en PORTAL)
// ============================================
function PlayerInput({
  rank,
  value,
  onChange,
  excludedIds,
}: {
  rank: 1 | 2 | 3
  value: PlayerPick | null
  onChange: (player: PlayerPick | null) => void
  excludedIds: string[]
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PlayerPick[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const selectedRef = useRef<HTMLDivElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

  const rankLabel = rank === 1 ? "1er" : rank === 2 ? "2e" : "3e"
  const rankSubtitle =
    rank === 1 ? "+30 pts si bon" : rank === 2 ? "+10 pts si bon" : "+5 pts si bon"

  // Calcule la position du dropdown sur l'input
  useEffect(() => {
    if (showResults && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [showResults, query])

  // Recherche débouncée
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }
    setIsSearching(true)
    const timer = setTimeout(async () => {
      const result = await searchPlayers(query)
      if (result.ok && result.players) {
        const filtered = result.players.filter((p) => !excludedIds.includes(p.id))
        setResults(filtered as PlayerPick[])
      }
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, excludedIds])

  // Animation pulse au pick
  useEffect(() => {
    if (value && selectedRef.current) {
      gsap.fromTo(
        selectedRef.current,
        { scale: 0.96 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
      )
    }
  }, [value])

  const handlePick = (player: PlayerPick) => {
    onChange(player)
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  const handleClear = () => {
    onChange(null)
    setQuery("")
  }

  return (
    <div className="relative">
      {/* Label rank */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs uppercase tracking-widest font-bold text-accent">
          {rankLabel}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-white/40">
          {rankSubtitle}
        </span>
      </div>

      {value ? (
        // Joueur sélectionné — fond bleu opaque
        <div
          ref={selectedRef}
          className="flex items-center gap-3 p-3 rounded-lg border border-accent/60"
          style={{ backgroundColor: "#1a3a5c" }}
        >
          {value.team.crestUrl ? (
            <img
              src={value.team.crestUrl}
              alt=""
              className="w-7 h-7 object-contain shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {value.name}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/50">
              {value.team.tla ?? value.team.name}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-white/50 hover:text-white transition-colors shrink-0"
            aria-label="Retirer"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
      ) : (
        // Input recherche
        <>
          <div
            ref={inputContainerRef}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/5 border border-accent/20 focus-within:border-accent/60 focus-within:bg-accent/10 transition-all"
          >
            <MagnifyingGlass size={14} className="text-accent/60 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="Rechercher un joueur..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40"
            />
            {isSearching && <span className="text-xs text-accent/60">...</span>}
          </div>

          {/* Dropdown rendu en PORTAL dans <body> */}
          {showResults &&
            (results.length > 0 ||
              (query.length >= 2 && !isSearching)) &&
            typeof window !== "undefined" &&
            createPortal(
              <div
                style={{
                  position: "absolute",
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  zIndex: 99999,
                  backgroundColor: "#0a1929",
                }}
                className="p-2 rounded-lg border border-accent/40 shadow-2xl shadow-black/80 max-h-64 overflow-y-auto"
              >
                {results.length > 0 ? (
                  results.map((player) => (
                    <button
                      key={player.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handlePick(player)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent/15 transition-colors text-left"
                    >
                      {player.team.crestUrl ? (
                        <img
                          src={player.team.crestUrl}
                          alt=""
                          className="w-6 h-6 object-contain shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
                      )}
                      <p className="text-sm font-semibold text-white truncate flex-1">
                        {player.name}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-white/60 text-center py-2">
                    Aucun joueur trouvé
                  </p>
                )}
              </div>,
              document.body
            )}
        </>
      )}
    </div>
  )
}