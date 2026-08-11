import GlassCard from '../../components/GlassCard'
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart'
import CategoryDonutChart from '../../components/charts/CategoryDonutChart'
import WeeklySpendingChart from '../../components/charts/WeeklySpendingChart'
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart'
import SavingsProgressChart from '../../components/charts/SavingsProgressChart'
import { ChartSkeleton, ErrorState, EmptyState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'
import {
  computeMonthlyTrend,
  computeCategoryBreakdown,
  computeWeeklySpending,
} from '../../utils/financeCalculations'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  const { transactions, savingsGoals, isLoading, error, refetch } = useDashboardDataContext()

  if (error) return <ErrorState message={error} onRetry={refetch} />

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <ChartSkeleton />
        <div className="grid lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    )
  }

  const monthlyTrend = computeMonthlyTrend(transactions, 6)
  const categoryBreakdown = computeCategoryBreakdown(transactions)
  const weeklySpending = computeWeeklySpending(transactions)
  const activeGoals = savingsGoals.filter((g) => g.status !== 'abandoned')

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Analytics</h1>
          <p className="text-sm text-ink-500 mt-1">Deeper insight into your spending patterns.</p>
        </div>
        <GlassCard>
          <EmptyState
            icon={<BarChart3 className="w-5 h-5" />}
            title="Not enough data yet"
            description="Once you've logged a few transactions, your charts will appear here."
          />
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Analytics</h1>
        <p className="text-sm text-ink-500 mt-1">Deeper insight into your spending patterns.</p>
      </div>

      <GlassCard className="p-5 sm:p-6">
        <p className="text-sm font-semibold text-ink-100 mb-1">Monthly Trend</p>
        <p className="text-xs text-ink-500 mb-4">Net cash flow (income − expenses) over time</p>
        <MonthlyTrendChart data={monthlyTrend} />
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-ink-100 mb-4">Income vs Expense</p>
          <IncomeExpenseChart data={monthlyTrend} />
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-ink-100 mb-4">Category Breakdown</p>
          {categoryBreakdown.length > 0 ? (
            <CategoryDonutChart data={categoryBreakdown} />
          ) : (
            <p className="text-xs text-ink-500 py-8 text-center">No expenses recorded this month.</p>
          )}
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-ink-100 mb-4">Weekly Spending</p>
          <WeeklySpendingChart data={weeklySpending} />
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-ink-100 mb-4">Savings Progress</p>
          {activeGoals.length > 0 ? (
            <SavingsProgressChart goals={activeGoals} />
          ) : (
            <p className="text-xs text-ink-500 py-8 text-center">No savings goals yet.</p>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
