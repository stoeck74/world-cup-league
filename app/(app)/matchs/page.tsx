// app/matchs/page.tsx
import { auth } from "@/../auth"
import { 
  fakeGroupMatches, 
  fakeRound32Matches, 
  fakeStages 
} from "@/lib/fake-data/matches"
import { MatchsView } from "@/components/matches/MatchsView"
import { redirect } from "next/navigation"

export default async function MatchsPage() {
  const session = await auth()

  // Protection de la route : si pas de session, on redirige ou on retourne null
  if (!session) {
    redirect("/api/auth/signin")
  }

  /**
   * On combine tous les matchs disponibles.
   * La MatchsView s'occupera de basculer entre :
   * - La vue par Groupes (si currentStage === "GROUP")
   * - La vue Bracket/Liste finale (si currentStage !== "GROUP")
   */
  const allMatches = [...fakeGroupMatches, ...fakeRound32Matches]

  return (
    <MatchsView
      matches={allMatches}
      stages={fakeStages}
      currentStage="GROUP"
    />
  )
}