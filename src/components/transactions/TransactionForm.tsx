import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Tag, Calendar, Wallet, CreditCard, MessageSquare } from 'lucide-react'
import FormField from '../auth/FormField'
import SelectField from './SelectField'
import Button from '../Button'
import { transactionSchema, paymentMethods, currencies, type TransactionFormValues } from '../../utils/transactionSchemas'
import type { Category } from '../../types/database'

interface TransactionFormProps {
  categories: Category[]
  defaultValues?: Partial<TransactionFormValues>
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: TransactionFormValues) => void
  onCancel: () => void
}

function toDateInputValue(iso?: string): string {
  const d = iso ? new Date(iso) : new Date()
  return d.toISOString().slice(0, 10)
}

export default function TransactionForm({
  categories,
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      kind: 'expense',
      merchant: '',
      amount: undefined,
      categoryId: '',
      occurredAt: toDateInputValue(),
      paymentMethod: 'card',
      currency: 'INR',
      note: '',
      ...defaultValues,
    },
  })

  const kind = watch('kind')
  const relevantCategories = categories.filter((c) => c.kind === kind)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-300">Type</span>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200">
          {(['expense', 'income'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setValue('kind', option)
                setValue('categoryId', '')
              }}
              className={`relative py-2 rounded-lg text-sm font-semibold capitalize transition-colors duration-200 ${
                kind === option ? 'text-white' : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              {kind === option && (
                <motion.span
                  layoutId="transaction-type-pill"
                  className={`absolute inset-0 rounded-lg ${
                    option === 'income' ? 'bg-mint-emerald' : 'bg-rose-500'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <FormField
        label="Description"
        placeholder="e.g. Burger King, Salary — Acme Corp"
        icon={<MessageSquare className="w-4 h-4" />}
        error={errors.merchant?.message}
        {...register('merchant')}
      />

      <FormField
        label="Amount"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        icon={<Wallet className="w-4 h-4" />}
        error={errors.amount?.message}
        {...register('amount')}
      />

      <SelectField
        label="Category"
        icon={<Tag className="w-4 h-4" />}
        error={errors.categoryId?.message}
        {...register('categoryId')}
      >
        <option value="">Select a category</option>
        {relevantCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </SelectField>

      <FormField
        label="Date"
        type="date"
        icon={<Calendar className="w-4 h-4" />}
        error={errors.occurredAt?.message}
        {...register('occurredAt')}
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Payment Method"
          icon={<CreditCard className="w-4 h-4" />}
          error={errors.paymentMethod?.message}
          {...register('paymentMethod')}
        >
          {paymentMethods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </SelectField>

        <SelectField label="Currency" error={errors.currency?.message} {...register('currency')}>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-medium text-ink-300">
          Notes <span className="text-ink-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="note"
          rows={3}
          placeholder="Any extra detail worth remembering..."
          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-all duration-200 focus:border-mint/50 focus:shadow-glow-sm resize-none"
          {...register('note')}
        />
        {errors.note && <p className="text-xs text-rose-500">{errors.note.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="md" className="flex-1" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
