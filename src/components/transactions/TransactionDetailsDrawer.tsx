import { Pencil, Trash2, Mic, FileText, Upload, Calendar, CreditCard, Tag, StickyNote } from 'lucide-react'
import SlideDrawer from './SlideDrawer'
import Button from '../Button'
import type { Transaction } from '../../types/database'

const sourceLabel: Record<Transaction['source'], { label: string; icon: typeof Mic }> = {
  voice: { label: 'Logged by voice', icon: Mic },
  manual: { label: 'Added manually', icon: FileText },
  import: { label: 'Imported', icon: Upload },
}

const paymentMethodLabel: Record<string, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  wallet: 'Wallet',
  other: 'Other',
}

interface DetailRowProps {
  icon: typeof Tag
  label: string
  value: string
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-ink-500" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-sm font-medium text-ink-100 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  )
}

interface TransactionDetailsDrawerProps {
  transaction: Transaction | null
  onClose: () => void
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export default function TransactionDetailsDrawer({
  transaction,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailsDrawerProps) {
  if (!transaction) {
    return <SlideDrawer open={false} onClose={onClose} title="" children={null} />
  }

  const isIncome = transaction.kind === 'income'
  const source = sourceLabel[transaction.source]

  return (
    <SlideDrawer open={!!transaction} onClose={onClose} title="Transaction Details">
      <div className="flex flex-col items-center text-center py-4 mb-2">
        <span
          className={`text-3xl font-bold font-display ${isIncome ? 'text-mint' : 'text-ink-100'}`}
        >
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </span>
        <span
          className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
            isIncome ? 'bg-mint/10 text-mint' : 'bg-rose-500/10 text-rose-500'
          }`}
        >
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </div>

      <div className="rounded-xl border border-slate-200 px-4">
        <DetailRow icon={Tag} label="Merchant" value={transaction.merchant} />
        <DetailRow
          icon={Tag}
          label="Category"
          value={transaction.category?.name ?? 'Uncategorized'}
        />
        <DetailRow
          icon={Calendar}
          label="Date"
          value={new Date(transaction.occurred_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        />
        <DetailRow
          icon={CreditCard}
          label="Payment Method"
          value={
            transaction.payment_method ? paymentMethodLabel[transaction.payment_method] : 'Not set'
          }
        />
        {transaction.note && <DetailRow icon={StickyNote} label="Notes" value={transaction.note} />}
        <DetailRow
          icon={source.icon}
          label="Source"
          value={`${source.label} · ${new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        />
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="secondary"
          size="md"
          className="flex-1"
          icon={<Pencil className="w-3.5 h-3.5" />}
          onClick={() => onEdit(transaction)}
        >
          Edit
        </Button>
        <button
          type="button"
          onClick={() => onDelete(transaction)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 text-rose-500 text-sm font-semibold px-5 py-2.5 transition-all duration-300 hover:bg-rose-50 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </SlideDrawer>
  )
}
