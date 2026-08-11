import { useState } from 'react'
import SlideDrawer from './SlideDrawer'
import TransactionForm from './TransactionForm'
import { createTransaction, updateTransaction } from '../../services/transactionsService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import type { Category, Transaction } from '../../types/database'
import type { TransactionFormValues } from '../../utils/transactionSchemas'

interface TransactionFormDrawerProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  editingTransaction: Transaction | null
  onSaved: () => void
}

export default function TransactionFormDrawer({
  open,
  onClose,
  categories,
  editingTransaction,
  onSaved,
}: TransactionFormDrawerProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!editingTransaction

  const defaultValues: Partial<TransactionFormValues> | undefined = editingTransaction
    ? {
        kind: editingTransaction.kind,
        merchant: editingTransaction.merchant,
        amount: editingTransaction.amount,
        categoryId: editingTransaction.category_id ?? '',
        occurredAt: editingTransaction.occurred_at.slice(0, 10),
        paymentMethod: editingTransaction.payment_method ?? 'card',
        currency: editingTransaction.currency,
        note: editingTransaction.note ?? '',
      }
    : undefined

  const handleSubmit = async (values: TransactionFormValues) => {
    if (!user) {
      showToast('Your session has expired. Please sign in again.', 'error')
      return
    }
    setIsSubmitting(true)

    const input = {
      kind: values.kind,
      merchant: values.merchant.trim(),
      amount: values.amount,
      categoryId: values.categoryId,
      occurredAt: new Date(values.occurredAt).toISOString(),
      paymentMethod: values.paymentMethod,
      currency: values.currency,
      note: values.note?.trim() || null,
    }

    const result = isEditing
      ? await updateTransaction(editingTransaction.id, input)
      : await createTransaction(user.id, input)

    setIsSubmitting(false)

    if (result.error) {
      showToast(result.error, 'error')
      return
    }

    showToast(isEditing ? 'Transaction updated.' : 'Transaction added.', 'success')
    onSaved()
    onClose()
  }

  return (
    <SlideDrawer
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      description={
        isEditing ? 'Update the details of this transaction.' : 'Log a new income or expense.'
      }
    >
      <TransactionForm
        key={editingTransaction?.id ?? 'new'}
        categories={categories}
        defaultValues={defaultValues}
        submitLabel={isEditing ? 'Save Changes' : 'Add Transaction'}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </SlideDrawer>
  )
}
