import { motion } from 'framer-motion'
import { Pencil, Trash2, Mic, FileText, Upload } from 'lucide-react'
import type { Transaction } from '../../types/database'

const sourceIcon = { voice: Mic, manual: FileText, import: Upload } as const

const paymentMethodLabel: Record<string, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  wallet: 'Wallet',
  other: 'Other',
}

interface TransactionCardProps {
  transaction: Transaction
  index: number
  onView: (t: Transaction) => void
  onEdit: (t: Transaction) => void
  onDelete: (t: Transaction) => void
}

export default function TransactionCard({ transaction, index, onView, onEdit, onDelete }: TransactionCardProps) {
  const isIncome = transaction.kind === 'income'
  const SourceIcon = sourceIcon[transaction.source]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      onClick={() => onView(transaction)}
      className="rounded-2xl bg-white border border-slate-200 p-4 cursor-pointer hover:border-mint/25 hover:shadow-soft transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${transaction.category?.color ?? '#64748B'}1A`,
              color: transaction.category?.color ?? '#64748B',
            }}
          >
            <SourceIcon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-100 truncate">{transaction.merchant}</p>
            <p className="text-xs text-ink-500 mt-0.5 truncate">
              {transaction.category?.name ?? 'Uncategorized'}
            </p>
          </div>
        </div>
        <p className={`text-sm font-bold flex-shrink-0 ${isIncome ? 'text-mint' : 'text-ink-100'}`}>
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span>
            {new Date(transaction.occurred_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {transaction.payment_method && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{paymentMethodLabel[transaction.payment_method]}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(transaction)}
            aria-label="Edit transaction"
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(transaction)}
            aria-label="Delete transaction"
            className="p-1.5 rounded-lg text-ink-500 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
