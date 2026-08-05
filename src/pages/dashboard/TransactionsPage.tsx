import GlassCard from '../../components/GlassCard'
import TransactionsTable from '../../components/transactions/TransactionsTable'
import { ListSkeleton, ErrorState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'

export default function TransactionsPage() {
  const { transactions, isLoading, error, refetch } = useDashboardDataContext()

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Transactions</h1>
        <p className="text-sm text-ink-500 mt-1">Every income and expense you've logged.</p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading ? (
        <ListSkeleton rows={8} />
      ) : (
        <GlassCard className="p-5 sm:p-6">
          <TransactionsTable transactions={transactions} />
        </GlassCard>
      )}
    </div>
  )
}
