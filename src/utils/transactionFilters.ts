import type { Transaction } from '../types/database'
import type { TransactionFilterState } from '../components/transactions/TransactionFilters'

export function applyTransactionFilters(
  transactions: Transaction[],
  filters: TransactionFilterState
): Transaction[] {
  let rows = transactions

  if (filters.kind !== 'all') {
    rows = rows.filter((t) => t.kind === filters.kind)
  }

  if (filters.categoryId) {
    rows = rows.filter((t) => t.category_id === filters.categoryId)
  }

  if (filters.paymentMethod) {
    rows = rows.filter((t) => t.payment_method === filters.paymentMethod)
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime()
    rows = rows.filter((t) => new Date(t.occurred_at).getTime() >= from)
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime() + 24 * 60 * 60 * 1000 - 1
    rows = rows.filter((t) => new Date(t.occurred_at).getTime() <= to)
  }

  if (filters.amountMin) {
    const min = Number(filters.amountMin)
    if (!Number.isNaN(min)) rows = rows.filter((t) => t.amount >= min)
  }

  if (filters.amountMax) {
    const max = Number(filters.amountMax)
    if (!Number.isNaN(max)) rows = rows.filter((t) => t.amount <= max)
  }

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    rows = rows.filter(
      (t) =>
        t.merchant.toLowerCase().includes(q) ||
        (t.note ?? '').toLowerCase().includes(q) ||
        (t.category?.name ?? '').toLowerCase().includes(q)
    )
  }

  const sorted = [...rows]
  switch (filters.sort) {
    case 'oldest':
      sorted.sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
      break
    case 'highest':
      sorted.sort((a, b) => b.amount - a.amount)
      break
    case 'lowest':
      sorted.sort((a, b) => a.amount - b.amount)
      break
    case 'income':
      sorted.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'income' ? -1 : 1))
      break
    case 'expense':
      sorted.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'expense' ? -1 : 1))
      break
    case 'newest':
    default:
      sorted.sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
  }

  return sorted
}
