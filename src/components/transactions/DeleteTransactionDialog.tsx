import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Button from '../Button'
import type { Transaction } from '../../types/database'

interface DeleteTransactionDialogProps {
  transaction: Transaction | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteTransactionDialog({
  transaction,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteTransactionDialogProps) {
  return (
    <AnimatePresence>
      {transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(400px,calc(100vw-2.5rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] p-6"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-400/25 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <h3 id="delete-dialog-title" className="text-base font-bold text-ink-100 font-display">
              Delete this transaction?
            </h3>
            <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
              <span className="font-medium text-ink-300">{transaction.merchant}</span> · ₹
              {transaction.amount.toLocaleString('en-IN')} will be permanently removed. This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Button variant="secondary" size="md" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 text-white text-sm font-semibold px-5 py-2.5 transition-all duration-300 hover:bg-rose-600 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
