import GlassCard from '../../components/GlassCard'
import CategoryDonutChart from '../../components/charts/CategoryDonutChart'
import TransactionsTable from '../../components/transactions/TransactionsTable'
import { ListSkeleton, ErrorState, EmptyState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'
import { computeCategoryBreakdown } from '../../utils/financeCalculations'
import { TrendingDown } from 'lucide-react'

export default function ExpensesPage() {
  const { transactions, isLoading, error, refetch } = useDashboardDataContext()
  const expenses = transactions.filter((t) => t.kind === 'expense')
  const categoryBreakdown = computeCategoryBreakdown(transactions)

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Expenses</h1>
        <p className="text-sm text-ink-500 mt-1">Where your money is going, by category.</p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading ? (
        <ListSkeleton rows={6} />
      ) : (
        <>
          {categoryBreakdown.length > 0 && (
            <GlassCard className="p-5 sm:p-6">
              <p className="text-sm font-semibold text-ink-100 mb-4">This Month by Category</p>
              <CategoryDonutChart data={categoryBreakdown} />
            </GlassCard>
          )}

          {expenses.length === 0 ? (
            <GlassCard>
              <EmptyState
                icon={<TrendingDown className="w-5 h-5" />}
                title="No expenses logged yet"
                description="Speak an expense out loud and it'll show up here, already categorized."
              />
            </GlassCard>
          ) : (
            <GlassCard className="p-5 sm:p-6">
              <TransactionsTable transactions={expenses} />
            </GlassCard>
          )}
        </>
      )}
    </div>
  )
}
