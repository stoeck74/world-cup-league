import { Trophy } from "@phosphor-icons/react/dist/ssr"

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

type ProfileGoldenBootProps = {
  picks: {
    first: PlayerPick | null
    second: PlayerPick | null
    third: PlayerPick | null
  }
}

export function ProfileGoldenBoot({ picks }: ProfileGoldenBootProps) {
  const hasAnyPick = picks.first || picks.second || picks.third

  if (!hasAnyPick) return null

  return (
    <section className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">
          Meilleurs <span className="text-accent">Buteurs</span>
        </h2>
      </div>

      <div className="space-y-2">
        <PickRow rank={1} pick={picks.first} />
        <PickRow rank={2} pick={picks.second} />
        <PickRow rank={3} pick={picks.third} />
      </div>
    </section>
  )
}

function PickRow({ rank, pick }: { rank: 1 | 2 | 3; pick: PlayerPick | null }) {
  const rankLabel = rank === 1 ? "1er" : rank === 2 ? "2e" : "3e"
  const rankColor =
    rank === 1
      ? "text-accent"
      : rank === 2
      ? "text-primary"
      : "text-text-muted"

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-black/20 py-4 pl-6 ">
      <span className={`text-xs font-bold uppercase tracking-widest ${rankColor} shrink-0 w-6`}>
        {rankLabel}
      </span>

      {pick ? (
        <>
          {pick.team.crestUrl ? (
            <img
              src={pick.team.crestUrl}
              alt={pick.team.tla ?? ""}
              className="w-6 h-6 object-contain shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {pick.name}
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-text-muted italic">Pas de choix</p>
      )}
    </div>
  )
}