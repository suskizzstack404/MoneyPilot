import { z } from 'zod'

export const paymentMethods = [
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'other', label: 'Other' },
] as const

export const currencies = ['INR', 'USD', 'EUR', 'GBP'] as const

export const transactionSchema = z.object({
  kind: z.enum(['income', 'expense'], { required_error: 'Select a transaction type' }),
  merchant: z.string().min(1, 'Description is required').max(120, 'Keep it under 120 characters'),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .gt(0, 'Amount must be greater than 0'),
  categoryId: z.string().min(1, 'Select a category'),
  occurredAt: z.string().min(1, 'Date is required'),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'bank_transfer', 'wallet', 'other'], {
    required_error: 'Select a payment method',
  }),
  currency: z.string().min(1, 'Select a currency'),
  note: z.string().max(500, 'Keep notes under 500 characters').optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
