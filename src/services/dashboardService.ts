import { supabase } from '../lib/supabase/client'
import type {
  Profile,
  Category,
  Transaction,
  IncomeEntry,
  SavingsGoal,
  Subscription,
  UserPreferences,
} from '../types/database'

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data
}

export async function fetchCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function fetchTransactions(
  userId: string,
  options: { limit?: number; kind?: 'income' | 'expense' } = {}
): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false })

  if (options.kind) {
    query = query.eq('kind', options.kind)
  }
  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function fetchIncomeEntries(userId: string): Promise<IncomeEntry[]> {
  const { data, error } = await supabase
    .from('income')
    .select('*')
    .eq('user_id', userId)
    .order('received_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchSavingsGoals(userId: string): Promise<SavingsGoal[]> {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchSubscriptions(userId: string): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('next_renewal_date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function fetchUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateUserPreferences(
  userId: string,
  updates: Partial<
    Pick<
      UserPreferences,
      | 'theme'
      | 'default_voice_language'
      | 'notifications_enabled'
      | 'budget_alerts_enabled'
      | 'weekly_summary_enabled'
      | 'biometric_lock_enabled'
    >
  >
): Promise<void> {
  const { error } = await supabase.from('user_preferences').update(updates).eq('user_id', userId)
  if (error) throw error
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'preferred_currency'>>
): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
  if (error) throw error
}

export async function createTransaction(
  userId: string,
  input: {
    kind: 'income' | 'expense'
    merchant: string
    amount: number
    categoryId?: string | null
    note?: string
    occurredAt?: string
  }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      kind: input.kind,
      merchant: input.merchant,
      amount: input.amount,
      category_id: input.categoryId ?? null,
      note: input.note ?? null,
      occurred_at: input.occurredAt ?? new Date().toISOString(),
      source: 'manual',
    })
    .select('*, category:categories(*)')
    .single()
  if (error) throw error
  return data
}

/**
 * Subscribes to realtime changes on every dashboard-relevant table for this
 * user and invokes `onChange` whenever any of them insert/update/delete a row.
 * Returns an unsubscribe function.
 */
export function subscribeToDashboardChanges(userId: string, onChange: () => void): () => void {
  const channel = supabase
    .channel(`dashboard-changes-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` },
      onChange
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'income', filter: `user_id=eq.${userId}` },
      onChange
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'savings_goals', filter: `user_id=eq.${userId}` },
      onChange
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${userId}` },
      onChange
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
