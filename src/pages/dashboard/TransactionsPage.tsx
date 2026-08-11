import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Receipt } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import Button from '../../components/Button'
import TransactionSummary from '../../components/transactions/TransactionSummary'
import TransactionFilters, {
  defaultFilters,
  type TransactionFilterState,
} from '../../components/transactions/TransactionFilters'
import TransactionTable from '../../components/transactions/TransactionTable'
import TransactionFormDrawer from '../../components/transactions/TransactionFormDrawer'
import TransactionDetailsDrawer from '../../components/transactions/TransactionDetailsDrawer'
import DeleteTransactionDialog from '../../components/transactions/DeleteTransactionDialog'
import { CardSkeleton, ListSkeleton, ErrorState, EmptyState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'
import { useToast } from '../../contexts/ToastContext'
import { computeTransactionSummary } from '../../utils/financeCalculations'
import { applyTransactionFilters } from '../../utils/transactionFilters'
import { deleteTransaction } from '../../services/transactionsService'
import type { Transaction } from '../../types/database'

export default function TransactionsPage() {
  const { transactions, categories, isLoading, error, refetch } = useDashboardDataContext()
  const { showToast } = useToast()

  const [filters, setFilters] = useState<TransactionFilterState>(defaultFilters)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const summary = useMemo(() => computeTransactionSummary(transactions), [transactions])
  const filteredTransactions = useMemo(
    () => applyTransactionFilters(transactions, filters),
    [transactions, filters]
  )

  const openAddDrawer = () => {
    setEditingTransaction(null)
    setFormOpen(true)
  }

  const openEditDrawer = (t: Transaction) => {
    setViewingTransaction(null)
    setEditingTransaction(t)
    setFormOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return
    setIsDeleting(true)
    const { error: deleteError } = await deleteTransaction(deletingTransaction.id)
    setIsDeleting(false)

    if (deleteError) {
      showToast(deleteError, 'error')
      return
    }

    showToast('Transaction deleted.', 'success')
    setDeletingTransaction(null)
    setViewingTransaction(null)
    refetch()
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Transactions</h1>
          <p className="text-sm text-ink-500 mt-1">Track and manage your income and expenses.</p>
        </div>
        <Button size="md" icon={<Plus className="w-4 h-4" />} onClick={openAddDrawer}>
          Add Transaction
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <TransactionSummary summary={summary} />
      )}

      {isLoading ? (
        <ListSkeleton rows={8} />
      ) : transactions.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<Receipt className="w-5 h-5" />}
            title="No transactions yet"
            description="Start tracking your money by adding your first transaction."
            action={
              <Button size="md" icon={<Plus className="w-4 h-4" />} onClick={openAddDrawer}>
                Add Transaction
              </Button>
            }
          />
        </GlassCard>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="p-5 sm:p-6">
            <div className="mb-5">
              <TransactionFilters filters={filters} onChange={setFilters} categories={categories} />
            </div>
            <TransactionTable
              transactions={filteredTransactions}
              onView={setViewingTransaction}
              onEdit={openEditDrawer}
              onDelete={setDeletingTransaction}
              onAddFirst={openAddDrawer}
            />
          </GlassCard>
        </motion.div>
      )}

      <TransactionFormDrawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        categories={categories}
        editingTransaction={editingTransaction}
        onSaved={refetch}
      />

      <TransactionDetailsDrawer
        transaction={viewingTransaction}
        onClose={() => setViewingTransaction(null)}
        onEdit={openEditDrawer}
        onDelete={setDeletingTransaction}
      />

      <DeleteTransactionDialog
        transaction={deletingTransaction}
        isDeleting={isDeleting}
        onCancel={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
