import { auth } from "@/../auth"
import { GroupStage } from "@/components/groups/GroupStage"
import { fakeGroups } from "@/lib/fake-data/groups"

export default async function ClassementPage() {
  const session = await auth()
  if (!session) return null

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
            Classements
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Phase de <span className="text-accent">poules</span>
          </h1>
          <p className="text-text-secondary mt-1">
            12 groupes · 48 nations · 72 matchs
          </p>
        </header>

        <GroupStage groups={fakeGroups} />
      </div>
    </div>
  )
}