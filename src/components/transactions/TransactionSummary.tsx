import { Receipt, TrendingUp, TrendingDown, Scale } from 'lucide-react'
import StatCard from '../cards/StatCard'
import type { TransactionSummary as TransactionSummaryData } from '../../utils/financeCalculations'

export default function TransactionSummary({ summary }: { summary: TransactionSummaryData }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Transactions"
        value={summary.totalCount}
        change={summary.totalCountChange}
        currencySymbol=""
        icon={<Receipt className="w-5 h-5" />}
        accent="teal"
        delay={0}
      />
      <StatCard
        label="Total Income"
        value={summary.totalIncome}
        change={summary.totalIncomeChange}
        icon={<TrendingUp className="w-5 h-5" />}
        accent="mint"
        delay={0.05}
      />
      <StatCard
        label="Total Expenses"
        value={summary.totalExpenses}
        change={summary.totalExpensesChange}
        invertSentiment
        icon={<TrendingDown className="w-5 h-5" />}
        accent="rose"
        delay={0.1}
      />
      <StatCard
        label="Net Cash Flow"
        value={summary.netCashFlow}
        change={summary.netCashFlowChange}
        icon={<Scale className="w-5 h-5" />}
        accent="mint"
        delay={0.15}
      />
    </div>
  )
}
