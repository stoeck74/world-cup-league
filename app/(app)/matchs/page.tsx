import { auth } from "@/../auth"
import { fakeGroupMatches, fakeStages } from "@/lib/fake-data/matches"
import { MatchsView } from "@/components/matches/MatchsView"

export default async function MatchsPage() {
  const session = await auth()
  if (!session) return null

  return (
    <MatchsView
      matches={fakeGroupMatches}
      stages={fakeStages}
      currentStage="GROUP"
    />
  )
}
