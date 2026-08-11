import { supabase } from '../lib/supabase/client'
import type { Transaction, TransactionKind, PaymentMethod } from '../types/database'

export interface TransactionInput {
  kind: TransactionKind
  merchant: string
  amount: number
  categoryId: string | null
  occurredAt: string
  paymentMethod: PaymentMethod | null
  currency: string
  note: string | null
}

function normalizeError(error: { message?: string } | null): string {
  if (!error) return 'Something went wrong. Please try again.'
  const message = error.message ?? 'Something went wrong. Please try again.'
  // Never surface raw Postgres/Supabase errors to the user.
  if (message.toLowerCase().includes('row-level security')) {
    return "You don't have permission to do that."
  }
  if (message.toLowerCase().includes('violates check constraint')) {
    return 'Some of the values you entered are invalid.'
  }
  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
    return 'Network error. Check your connection and try again.'
  }
  return 'Failed to save your changes. Please try again.'
}

export async function createTransaction(
  userId: string,
  input: TransactionInput
): Promise<{ data: Transaction | null; error: string | null }> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      kind: input.kind,
      merchant: input.merchant,
      amount: input.amount,
      category_id: input.categoryId,
      occurred_at: input.occurredAt,
      payment_method: input.paymentMethod,
      currency: input.currency,
      note: input.note,
      source: 'manual',
    })
    .select('*, category:categories(*)')
    .single()

  if (error) return { data: null, error: normalizeError(error) }
  return { data, error: null }
}

export async function updateTransaction(
  id: string,
  input: TransactionInput
): Promise<{ data: Transaction | null; error: string | null }> {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      kind: input.kind,
      merchant: input.merchant,
      amount: input.amount,
      category_id: input.categoryId,
      occurred_at: input.occurredAt,
      payment_method: input.paymentMethod,
      currency: input.currency,
      note: input.note,
    })
    .eq('id', id)
    .select('*, category:categories(*)')
    .single()

  if (error) return { data: null, error: normalizeError(error) }
  return { data, error: null }
}

export async function deleteTransaction(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) return { error: normalizeError(error) }
  return { error: null }
}
