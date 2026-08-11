import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Eye,
  Circle,
  Utensils,
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
import TransactionCard from './TransactionCard'
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
  return categoryIconMap[name] ?? Circle
}

const paymentMethodLabel: Record<string, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  wallet: 'Wallet',
  other: 'Other',
}

const PAGE_SIZE = 10

interface TransactionTableProps {
  transactions: Transaction[]
  onView: (t: Transaction) => void
  onEdit: (t: Transaction) => void
  onDelete: (t: Transaction) => void
  onAddFirst: () => void
}

export default function TransactionTable({
  transactions,
  onView,
  onEdit,
  onDelete,
  onAddFirst,
}: TransactionTableProps) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [transactions.length])

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="Try adjusting your search or filters, or add your first transaction."
        action={
          <button
            onClick={onAddFirst}
            className="text-sm font-semibold text-mint hover:underline"
          >
            Add Transaction
          </button>
        }
      />
    )
  }

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
  const pageRows = transactions.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto -mx-2">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-xs text-ink-500 border-b border-slate-200">
              <th className="font-medium px-2 pb-3">Merchant / Description</th>
              <th className="font-medium px-2 pb-3">Category</th>
              <th className="font-medium px-2 pb-3">Type</th>
              <th className="font-medium px-2 pb-3">Date</th>
              <th className="font-medium px-2 pb-3">Payment Method</th>
              <th className="font-medium px-2 pb-3">Amount</th>
              <th className="font-medium px-2 pb-3">Status</th>
              <th className="font-medium px-2 pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((t, i) => {
              const CategoryIcon = resolveCategoryIcon(t.category?.icon)
              const isIncome = t.kind === 'income'
              return (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => onView(t)}
                  className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150 cursor-pointer"
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
                      <div className="min-w-0">
                        <p className="font-medium text-ink-100 truncate max-w-[220px]">
                          {t.merchant}
                        </p>
                        {t.note && (
                          <p className="text-xs text-ink-500 truncate max-w-[220px]">{t.note}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3.5 text-ink-300">{t.category?.name ?? 'Uncategorized'}</td>
                  <td className="px-2 py-3.5">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        isIncome ? 'bg-mint/10 text-mint' : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {t.kind}
                    </span>
                  </td>
                  <td className="px-2 py-3.5 text-ink-500 whitespace-nowrap">
                    {new Date(t.occurred_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-2 py-3.5 text-ink-500">
                    {t.payment_method ? paymentMethodLabel[t.payment_method] : '—'}
                  </td>
                  <td
                    className={`px-2 py-3.5 font-semibold whitespace-nowrap ${
                      isIncome ? 'text-mint' : 'text-ink-100'
                    }`}
                  >
                    {isIncome ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-2 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-mint bg-mint/10 px-2.5 py-1 rounded-full">
                      Completed
                    </span>
                  </td>
                  <td className="px-2 py-3.5">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onView(t)}
                        aria-label="View details"
                        className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(t)}
                        aria-label="Edit transaction"
                        className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        aria-label="Delete transaction"
                        className="p-1.5 rounded-lg text-ink-500 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex md:hidden flex-col gap-3">
        {pageRows.map((t, i) => (
          <TransactionCard
            key={t.id}
            transaction={t}
            index={i}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200">
          <p className="text-xs text-ink-500">
            Page {page + 1} of {totalPages} · {transactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
