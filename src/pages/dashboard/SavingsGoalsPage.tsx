import { PiggyBank } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import SavingsGoalsPanel from '../../components/dashboard/SavingsGoalsPanel'
import { ListSkeleton, ErrorState, EmptyState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'

export default function SavingsGoalsPage() {
  const { savingsGoals, isLoading, error, refetch } = useDashboardDataContext()
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.current_amount, 0)
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target_amount, 0)

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Savings Goals</h1>
        <p className="text-sm text-ink-500 mt-1">What you're saving toward, and how close you are.</p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading ? (
        <ListSkeleton rows={4} />
      ) : savingsGoals.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<PiggyBank className="w-5 h-5" />}
            title="No savings goals yet"
            description="Create your first goal — an emergency fund, a trip, anything you're saving toward."
          />
        </GlassCard>
      ) : (
        <>
          <GlassCard className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500">Total saved across all goals</p>
              <p className="text-2xl font-bold text-ink-100 font-display mt-1">
                ₹{totalSaved.toLocaleString('en-IN')}
              </p>
            </div>
            <p className="text-xs text-ink-500">
              of ₹{totalTarget.toLocaleString('en-IN')} target
            </p>
          </GlassCard>
          <SavingsGoalsPanel goals={savingsGoals} />
        </>
      )}
    </div>
  )
}
