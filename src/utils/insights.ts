import type { Transaction, Subscription } from '../types/database'
import type { InsightSeverity } from '../types/database'

export interface GeneratedInsight {
  id: string
  severity: InsightSeverity
  title: string
  message: string
}

function isSameMonth(dateStr: string, ref: Date): boolean {
  const d = new Date(dateStr)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

function monthsAgo(n: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

/**
 * Computes a handful of insight cards from real transaction/subscription data.
 * This is intentionally simple heuristics (month-over-month category deltas,
 * upcoming renewals) standing in for the AI backend described as "added later".
 */
export function generateInsights(
  transactions: Transaction[],
  subscriptions: Subscription[]
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = []
  const now = new Date()
  const lastMonth = monthsAgo(1)

  // 1) Category spend up month-over-month.
  const thisMonthByCategory = new Map<string, number>()
  const lastMonthByCategory = new Map<string, number>()

  for (const t of transactions) {
    if (t.kind !== 'expense') continue
    const label = t.category?.name ?? 'Uncategorized'
    if (isSameMonth(t.occurred_at, now)) {
      thisMonthByCategory.set(label, (thisMonthByCategory.get(label) ?? 0) + t.amount)
    } else if (isSameMonth(t.occurred_at, lastMonth)) {
      lastMonthByCategory.set(label, (lastMonthByCategory.get(label) ?? 0) + t.amount)
    }
  }

  let biggestIncrease: { label: string; pct: number; amount: number } | null = null
  for (const [label, amount] of thisMonthByCategory.entries()) {
    const previous = lastMonthByCategory.get(label) ?? 0
    if (previous <= 0) continue
    const pct = ((amount - previous) / previous) * 100
    if (pct > 10 && (!biggestIncrease || pct > biggestIncrease.pct)) {
      biggestIncrease = { label, pct, amount }
    }
  }

  if (biggestIncrease) {
    insights.push({
      id: 'category-increase',
      severity: biggestIncrease.pct > 30 ? 'critical' : 'warning',
      title: `${biggestIncrease.label} spend is up`,
      message: `You spent ${Math.round(biggestIncrease.pct)}% more on ${biggestIncrease.label.toLowerCase()} this month compared to last month.`,
    })
  }

  // 2) Upcoming subscription renewals within 7 days.
  const soon = subscriptions
    .filter((s) => s.status === 'active' && s.next_renewal_date)
    .map((s) => ({
      sub: s,
      daysUntil: Math.ceil(
        (new Date(s.next_renewal_date as string).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .filter((x) => x.daysUntil >= 0 && x.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil)[0]

  if (soon) {
    insights.push({
      id: 'subscription-renewal',
      severity: soon.daysUntil <= 2 ? 'warning' : 'info',
      title: `${soon.sub.merchant} renews soon`,
      message: `Your ${soon.sub.merchant} subscription renews in ${soon.daysUntil} day${soon.daysUntil === 1 ? '' : 's'} for ₹${soon.sub.amount.toLocaleString('en-IN')}.`,
    })
  }

  // 3) Potential savings suggestion from the largest expense category this month.
  const topCategory = Array.from(thisMonthByCategory.entries()).sort((a, b) => b[1] - a[1])[0]
  if (topCategory && topCategory[1] > 0) {
    const [label, amount] = topCategory
    const potentialSaving = Math.round(amount * 0.15)
    if (potentialSaving > 0) {
      insights.push({
        id: 'saving-suggestion',
        severity: 'info',
        title: 'A quick way to save',
        message: `You can save roughly ₹${potentialSaving.toLocaleString('en-IN')} by trimming ${label.toLowerCase()} spend by 15% this month.`,
      })
    }
  }

  // 4) Fallback when there's not enough data yet for the heuristics above.
  if (insights.length === 0) {
    insights.push({
      id: 'getting-started',
      severity: 'info',
      title: 'Insights are warming up',
      message:
        'Log a few more expenses by voice and MoneyPilot will start surfacing spending patterns here.',
    })
  }

  return insights.slice(0, 3)
}
