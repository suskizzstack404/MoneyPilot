import type { Transaction, SavingsGoal } from '../types/database'

function isSameMonth(dateStr: string, ref: Date): boolean {
  const d = new Date(dateStr)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

function monthsAgo(n: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export interface OverviewStats {
  currentBalance: number
  monthlyIncome: number
  monthlyIncomeChange: number
  monthlyExpenses: number
  monthlyExpensesChange: number
  totalSavings: number
  netCashFlow: number
  netCashFlowChange: number
}

export function computeOverviewStats(
  transactions: Transaction[],
  savingsGoals: SavingsGoal[]
): OverviewStats {
  const now = new Date()
  const lastMonth = monthsAgo(1)

  let currentBalance = 0
  let thisMonthIncome = 0
  let thisMonthExpenses = 0
  let lastMonthIncome = 0
  let lastMonthExpenses = 0

  for (const t of transactions) {
    const signedAmount = t.kind === 'income' ? t.amount : -t.amount
    currentBalance += signedAmount

    if (isSameMonth(t.occurred_at, now)) {
      if (t.kind === 'income') thisMonthIncome += t.amount
      else thisMonthExpenses += t.amount
    } else if (isSameMonth(t.occurred_at, lastMonth)) {
      if (t.kind === 'income') lastMonthIncome += t.amount
      else lastMonthExpenses += t.amount
    }
  }

  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.current_amount, 0)
  const netCashFlow = thisMonthIncome - thisMonthExpenses
  const lastNetCashFlow = lastMonthIncome - lastMonthExpenses

  return {
    currentBalance,
    monthlyIncome: thisMonthIncome,
    monthlyIncomeChange: percentChange(thisMonthIncome, lastMonthIncome),
    monthlyExpenses: thisMonthExpenses,
    monthlyExpensesChange: percentChange(thisMonthExpenses, lastMonthExpenses),
    totalSavings,
    netCashFlow,
    netCashFlowChange: percentChange(netCashFlow, lastNetCashFlow),
  }
}

export interface MonthlyPoint {
  label: string
  income: number
  expense: number
  net: number
}

/** Last `months` months (oldest to newest) of income/expense/net totals. */
export function computeMonthlyTrend(transactions: Transaction[], months = 6): MonthlyPoint[] {
  const points: MonthlyPoint[] = []

  for (let i = months - 1; i >= 0; i--) {
    const ref = monthsAgo(i)
    const label = ref.toLocaleDateString('en-US', { month: 'short' })
    let income = 0
    let expense = 0

    for (const t of transactions) {
      if (!isSameMonth(t.occurred_at, ref)) continue
      if (t.kind === 'income') income += t.amount
      else expense += t.amount
    }

    points.push({ label, income, expense, net: income - expense })
  }

  return points
}

export interface CategorySlice {
  label: string
  value: number
  color: string
}

/** This-month expense totals grouped by category. */
export function computeCategoryBreakdown(transactions: Transaction[]): CategorySlice[] {
  const now = new Date()
  const totals = new Map<string, { value: number; color: string }>()

  for (const t of transactions) {
    if (t.kind !== 'expense') continue
    if (!isSameMonth(t.occurred_at, now)) continue

    const label = t.category?.name ?? 'Uncategorized'
    const color = t.category?.color ?? '#7C8798'
    const existing = totals.get(label)
    totals.set(label, { value: (existing?.value ?? 0) + t.amount, color })
  }

  return Array.from(totals.entries())
    .map(([label, { value, color }]) => ({ label, value, color }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

export interface DayPoint {
  label: string
  amount: number
}

/** Expense totals for each of the last 7 days (oldest to newest). */
export function computeWeeklySpending(transactions: Transaction[]): DayPoint[] {
  const days: DayPoint[] = []

  for (let i = 6; i >= 0; i--) {
    const ref = new Date()
    ref.setDate(ref.getDate() - i)
    const label = ref.toLocaleDateString('en-US', { weekday: 'short' })

    let amount = 0
    for (const t of transactions) {
      if (t.kind !== 'expense') continue
      const d = new Date(t.occurred_at)
      if (
        d.getFullYear() === ref.getFullYear() &&
        d.getMonth() === ref.getMonth() &&
        d.getDate() === ref.getDate()
      ) {
        amount += t.amount
      }
    }
    days.push({ label, amount })
  }

  return days
}

/** Sparkline-friendly net cash flow for the last N days, oldest to newest. */
export function computeDailyNetTrend(transactions: Transaction[], days = 14): number[] {
  const points: number[] = []
  for (let i = days - 1; i >= 0; i--) {
    const ref = new Date()
    ref.setDate(ref.getDate() - i)
    let net = 0
    for (const t of transactions) {
      const d = new Date(t.occurred_at)
      if (
        d.getFullYear() === ref.getFullYear() &&
        d.getMonth() === ref.getMonth() &&
        d.getDate() === ref.getDate()
      ) {
        net += t.kind === 'income' ? t.amount : -t.amount
      }
    }
    points.push(net)
  }
  // Convert to a cumulative-looking sparkline so it's not just noisy zeros.
  let running = 0
  return points.map((p) => (running += p))
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  const symbol = currency === 'INR' ? '\u20B9' : ''
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`
}
