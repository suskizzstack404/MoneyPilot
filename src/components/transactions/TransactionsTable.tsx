import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Mic,
  Pencil,
  Upload,
  Utensils,
  Circle,
  Car,
  ShoppingBag,
  Receipt,
  Repeat,
  Film,
  HeartPulse,
  Plane,
  GraduationCap,
  Wallet,
  Briefcase,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { Transaction } from '../../types/database'
import { EmptyState } from '../dashboard/StateViews'

const categoryIconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  receipt: Receipt,
  repeat: Repeat,
  film: Film,
  'heart-pulse': HeartPulse,
  plane: Plane,
  'graduation-cap': GraduationCap,
  wallet: Wallet,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  circle: Circle,
}

function resolveCategoryIcon(name?: string): LucideIcon {
  if (!name) return Circle
  return categoryIconMap[name] ?? Utensils
}

const sourceIcon: Record<Transaction['source'], LucideIcon> = {
  voice: Mic,
  manual: Pencil,
  import: Upload,
}

type SortKey = 'occurred_at' | 'amount' | 'merchant'

const PAGE_SIZE = 8

export default function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState('')
  const [kindFilter, setKindFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('occurred_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let rows = transactions
    if (kindFilter !== 'all') {
      rows = rows.filter((t) => t.kind === kindFilter)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      rows = rows.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) || (t.category?.name ?? '').toLowerCase().includes(q)
      )
    }
    return [...rows].sort((a, b) => {
      let diff = 0
      if (sortKey === 'amount') diff = a.amount - b.amount
      else if (sortKey === 'merchant') diff = a.merchant.localeCompare(b.merchant)
      else diff = new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
      return sortAsc ? diff : -diff
    })
  }, [transactions, search, kindFilter, sortKey, sortAsc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((a) => !a)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
    setPage(0)
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Log an expense by voice or add one manually to see it appear here."
      />
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            placeholder="Search merchant or category..."
            className="w-full rounded-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-mint/40 transition-colors duration-200"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full p-1">
          {(['all', 'income', 'expense'] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                setKindFilter(k)
                setPage(0)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-colors duration-200 ${
                kindFilter === k ? 'bg-slate-100 text-ink-100' : 'text-ink-500 hover:text-ink-300'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matches" description="Try a different search term or filter." />
      ) : (
        <>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-ink-500 border-b border-slate-200">
                  <th className="font-medium px-2 pb-3">
                    <button
                      onClick={() => toggleSort('merchant')}
                      className="flex items-center gap-1 hover:text-ink-100 transition-colors"
                    >
                      Merchant <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="font-medium px-2 pb-3">Category</th>
                  <th className="font-medium px-2 pb-3">
                    <button
                      onClick={() => toggleSort('amount')}
                      className="flex items-center gap-1 hover:text-ink-100 transition-colors"
                    >
                      Amount <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="font-medium px-2 pb-3">
                    <button
                      onClick={() => toggleSort('occurred_at')}
                      className="flex items-center gap-1 hover:text-ink-100 transition-colors"
                    >
                      Date <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="font-medium px-2 pb-3">Source</th>
                  <th className="font-medium px-2 pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((t, i) => {
                  const CategoryIcon = resolveCategoryIcon(t.category?.icon)
                  const SourceIcon = sourceIcon[t.source]
                  return (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="px-2 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${t.category?.color ?? '#64748B'}1A`,
                              color: t.category?.color ?? '#64748B',
                            }}
                          >
                            <CategoryIcon className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-medium text-ink-100 whitespace-nowrap">
                            {t.merchant}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3.5 text-ink-300">{t.category?.name ?? 'Uncategorized'}</td>
                      <td
                        className={`px-2 py-3.5 font-semibold whitespace-nowrap ${
                          t.kind === 'income' ? 'text-mint' : 'text-ink-100'
                        }`}
                      >
                        {t.kind === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-2 py-3.5 text-ink-500 whitespace-nowrap">
                        {new Date(t.occurred_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-2 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-ink-500 capitalize">
                          <SourceIcon className="w-3.5 h-3.5" />
                          {t.source}
                        </span>
                      </td>
                      <td className="px-2 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-mint bg-mint/10 px-2.5 py-1 rounded-full">
                          Completed
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200">
              <p className="text-xs text-ink-500">
                Page {page + 1} of {totalPages} · {filtered.length} transactions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-ink-300 hover:text-ink-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-ink-300 hover:text-ink-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
