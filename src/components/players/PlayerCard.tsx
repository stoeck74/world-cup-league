import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

export type PlayerCardData = {
  username: string
  avatarStyle: string | null
  avatarSeed: string | null
  favoritePlayer: string | null
  favoriteTeam: {
    name: string
    tla: string
    crestUrl: string | null
  } | null
}

export function PlayerCard({ player }: { player: PlayerCardData }) {
  return (
    <Link
      href={`/joueurs/${player.username}`}
      className="group block rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 hover:border-white/20 transition-all p-5 md:p-6"
    >
      {/* Header : Avatar + Username + chevron */}
      <div className="flex items-center gap-3 mb-5">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
          {player.avatarStyle && player.avatarSeed ? (
            <img
              src={`https://api.dicebear.com/9.x/${player.avatarStyle}/svg?seed=${player.avatarSeed}`}
              alt={player.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-sm font-bold uppercase text-text-secondary">
                {player.username[0]}
              </span>
            </div>
          )}
        </div>

        {/* Username + chevron */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-text-primary truncate">
            {player.username}
          </p>
          <ArrowRight
            size={16}
            weight="bold"
            className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0"
          />
        </div>
      </div>

      {/* MVP */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
          Mon MVP
        </p>
        <p className="text-sm font-semibold text-text-primary truncate">
          {player.favoritePlayer || (
            <span className="text-text-muted italic font-normal">Non renseigné</span>
          )}
        </p>
      </div>

      {/* Équipe favorite */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
          Équipe
        </p>
        {player.favoriteTeam ? (
          <div className="flex items-center gap-2">
            {player.favoriteTeam.crestUrl ? (
              <img
                src={player.favoriteTeam.crestUrl}
                alt={player.favoriteTeam.name}
                className="w-5 h-5 object-contain shrink-0"
              />
            ) : (
              <span className="text-xs font-bold uppercase text-text-muted w-5 text-center">
                {player.favoriteTeam.tla}
              </span>
            )}
            <p className="text-sm font-semibold text-text-primary truncate">
              {player.favoriteTeam.name}
            </p>
          </div>
        ) : (
          <p className="text-sm text-text-muted italic">Non renseignée</p>
        )}
      </div>
    </Link>
  )
}