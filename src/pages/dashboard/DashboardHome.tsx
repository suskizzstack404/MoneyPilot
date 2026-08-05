import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowLeftRight } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import StatCard from '../../components/cards/StatCard'
import QuickActions from '../../components/dashboard/QuickActions'
import AIInsightsPanel from '../../components/dashboard/AIInsightsPanel'
import SavingsGoalsPanel from '../../components/dashboard/SavingsGoalsPanel'
import SubscriptionsPanel from '../../components/dashboard/SubscriptionsPanel'
import VoiceAssistantWidget from '../../components/voice/VoiceAssistantWidget'
import TransactionsTable from '../../components/transactions/TransactionsTable'
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart'
import WeeklySpendingChart from '../../components/charts/WeeklySpendingChart'
import { CardSkeleton, ChartSkeleton, ListSkeleton, ErrorState, EmptyState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'
import { generateInsights } from '../../utils/insights'
import {
  computeOverviewStats,
  computeMonthlyTrend,
  computeWeeklySpending,
  computeDailyNetTrend,
} from '../../utils/financeCalculations'

export default function DashboardHome() {
  const { transactions, savingsGoals, subscriptions, isLoading, error, refetch } =
    useDashboardDataContext()

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <ListSkeleton />
      </div>
    )
  }

  const stats = computeOverviewStats(transactions, savingsGoals)
  const monthlyTrend = computeMonthlyTrend(transactions, 6)
  const weeklySpending = computeWeeklySpending(transactions)
  const dailyNet = computeDailyNetTrend(transactions, 14)
  const insights = generateInsights(transactions, subscriptions)

  const activeGoals = savingsGoals.filter((g) => g.status === 'active').slice(0, 4)
  const activeSubs = subscriptions.filter((s) => s.status === 'active').slice(0, 5)

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Financial Overview */}
      <section>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display mb-4">
          Financial Overview
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Current Balance"
            value={stats.currentBalance}
            icon={<Wallet className="w-5 h-5" />}
            sparkline={dailyNet}
            accent="mint"
            delay={0}
          />
          <StatCard
            label="Monthly Income"
            value={stats.monthlyIncome}
            change={stats.monthlyIncomeChange}
            icon={<TrendingUp className="w-5 h-5" />}
            accent="mint"
            delay={0.05}
          />
          <StatCard
            label="Monthly Expenses"
            value={stats.monthlyExpenses}
            change={stats.monthlyExpensesChange}
            invertSentiment
            icon={<TrendingDown className="w-5 h-5" />}
            accent="rose"
            delay={0.1}
          />
          <StatCard
            label="Total Savings"
            value={stats.totalSavings}
            icon={<PiggyBank className="w-5 h-5" />}
            accent="teal"
            delay={0.15}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-ink-300 mb-3">Quick Actions</h2>
        <QuickActions />
      </section>

      {/* Analytics + Voice/Insights */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-ink-100">Income vs Expense</p>
                <span className="text-xs text-ink-500">Last 6 months</span>
              </div>
              <IncomeExpenseChart data={monthlyTrend} />
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-ink-100">Weekly Spending</p>
                <span className="text-xs text-ink-500">Last 7 days</span>
              </div>
              <WeeklySpendingChart data={weeklySpending} />
            </GlassCard>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4">
          <VoiceAssistantWidget />
          <div>
            <h2 className="text-sm font-semibold text-ink-300 mb-3">AI Insights</h2>
            <AIInsightsPanel insights={insights} />
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink-300">Recent Transactions</h2>
          <Link
            to="/dashboard/transactions"
            className="text-xs font-medium text-mint hover:underline flex items-center gap-1"
          >
            View all <ArrowLeftRight className="w-3 h-3" />
          </Link>
        </div>
        <GlassCard className="p-5 sm:p-6">
          <TransactionsTable transactions={transactions.slice(0, 8)} />
        </GlassCard>
      </section>

      {/* Savings Goals + Subscriptions */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-300">Savings Goals</h2>
            <Link to="/dashboard/savings-goals" className="text-xs font-medium text-mint hover:underline">
              View all
            </Link>
          </div>
          {activeGoals.length > 0 ? (
            <SavingsGoalsPanel goals={activeGoals} />
          ) : (
            <GlassCard>
              <EmptyState
                icon={<PiggyBank className="w-5 h-5" />}
                title="No savings goals yet"
                description="Create a goal to start tracking progress toward something you're saving for."
              />
            </GlassCard>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-300">Subscriptions</h2>
            <Link to="/dashboard/subscriptions" className="text-xs font-medium text-mint hover:underline">
              View all
            </Link>
          </div>
          {activeSubs.length > 0 ? (
            <SubscriptionsPanel subscriptions={activeSubs} />
          ) : (
            <GlassCard>
              <EmptyState
                title="No subscriptions tracked"
                description="MoneyPilot will flag recurring charges here as it detects them."
              />
            </GlassCard>
          )}
        </div>
      </section>
    </div>
  )
}
