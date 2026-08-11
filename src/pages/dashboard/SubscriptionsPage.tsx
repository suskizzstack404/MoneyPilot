import { Repeat } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import SubscriptionsPanel from '../../components/dashboard/SubscriptionsPanel'
import { ListSkeleton, ErrorState, EmptyState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'

export default function SubscriptionsPage() {
  const { subscriptions, isLoading, error, refetch } = useDashboardDataContext()
  const totalMonthly = subscriptions
    .filter((s) => s.status === 'active' && s.billing_cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Subscriptions</h1>
        <p className="text-sm text-ink-500 mt-1">
          Recurring charges MoneyPilot is tracking for you.
        </p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading ? (
        <ListSkeleton rows={5} />
      ) : subscriptions.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<Repeat className="w-5 h-5" />}
            title="No subscriptions yet"
            description="Add a subscription or let MoneyPilot detect one from your transactions."
          />
        </GlassCard>
      ) : (
        <>
          <GlassCard className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500">Active monthly commitment</p>
              <p className="text-2xl font-bold text-ink-100 font-display mt-1">
                ₹{totalMonthly.toLocaleString('en-IN')}
                <span className="text-sm text-ink-500 font-normal">/mo</span>
              </p>
            </div>
            <span className="text-xs text-ink-500">
              {subscriptions.filter((s) => s.status === 'active').length} active
            </span>
          </GlassCard>
          <SubscriptionsPanel subscriptions={subscriptions} />
        </>
      )}
    </div>
  )
}
