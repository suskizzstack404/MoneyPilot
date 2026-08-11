import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, ArrowUpDown, X, ChevronDown } from 'lucide-react'
import { paymentMethods } from '../../utils/transactionSchemas'
import type { Category } from '../../types/database'

export interface TransactionFilterState {
  search: string
  kind: 'all' | 'income' | 'expense'
  categoryId: string
  paymentMethod: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
  sort: 'newest' | 'oldest' | 'highest' | 'lowest' | 'income' | 'expense'
}

export const defaultFilters: TransactionFilterState = {
  search: '',
  kind: 'all',
  categoryId: '',
  paymentMethod: '',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sort: 'newest',
}

const sortOptions: { value: TransactionFilterState['sort']; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
  { value: 'income', label: 'Income first' },
  { value: 'expense', label: 'Expense first' },
]

interface TransactionFiltersProps {
  filters: TransactionFilterState
  onChange: (filters: TransactionFilterState) => void
  categories: Category[]
}

export default function TransactionFilters({ filters, onChange, categories }: TransactionFiltersProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFiltersOpen(false)
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeAdvancedCount = [
    filters.categoryId,
    filters.paymentMethod,
    filters.dateFrom,
    filters.dateTo,
    filters.amountMin,
    filters.amountMax,
  ].filter(Boolean).length

  const update = (patch: Partial<TransactionFilterState>) => onChange({ ...filters, ...patch })

  const clearAdvanced = () =>
    update({
      categoryId: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
    })

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search merchant, description, or category..."
          className="w-full rounded-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-mint/40 transition-colors duration-200"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full p-1">
          {(['all', 'income', 'expense'] as const).map((k) => (
            <button
              key={k}
              onClick={() => update({ kind: k })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-colors duration-200 ${
                filters.kind === k ? 'bg-white text-ink-100 shadow-soft' : 'text-ink-500 hover:text-ink-300'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Advanced filters popover */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="relative flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-100 hover:bg-slate-50 transition-colors duration-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeAdvancedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-mint-emerald text-white text-[10px] font-bold flex items-center justify-center">
                {activeAdvancedCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-card p-4 z-40"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-ink-100">Advanced filters</p>
                  {activeAdvancedCount > 0 && (
                    <button
                      onClick={clearAdvanced}
                      className="text-xs text-ink-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-ink-300 mb-1 block">Category</label>
                    <select
                      value={filters.categoryId}
                      onChange={(e) => update({ categoryId: e.target.value })}
                      className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-ink-100 outline-none focus:border-mint/40"
                    >
                      <option value="">All categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-300 mb-1 block">
                      Payment method
                    </label>
                    <select
                      value={filters.paymentMethod}
                      onChange={(e) => update({ paymentMethod: e.target.value })}
                      className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-ink-100 outline-none focus:border-mint/40"
                    >
                      <option value="">Any method</option>
                      {paymentMethods.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-300 mb-1 block">Date range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => update({ dateFrom: e.target.value })}
                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2 text-xs text-ink-100 outline-none focus:border-mint/40"
                      />
                      <span className="text-ink-500 text-xs">to</span>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => update({ dateTo: e.target.value })}
                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2 text-xs text-ink-100 outline-none focus:border-mint/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink-300 mb-1 block">
                      Amount range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={filters.amountMin}
                        onChange={(e) => update({ amountMin: e.target.value })}
                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2 text-xs text-ink-100 placeholder:text-ink-500 outline-none focus:border-mint/40"
                      />
                      <span className="text-ink-500 text-xs">–</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={filters.amountMax}
                        onChange={(e) => update({ amountMax: e.target.value })}
                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2 text-xs text-ink-100 placeholder:text-ink-500 outline-none focus:border-mint/40"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-100 hover:bg-slate-50 transition-colors duration-200"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortOptions.find((s) => s.value === filters.sort)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-slate-200 shadow-card p-1.5 z-40"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      update({ sort: opt.value })
                      setSortOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                      filters.sort === opt.value
                        ? 'text-mint bg-mint/5 font-medium'
                        : 'text-ink-300 hover:text-ink-100 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
