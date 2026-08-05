export type CategoryKind = 'income' | 'expense'
export type TransactionKind = 'income' | 'expense'
export type TransactionSource = 'voice' | 'manual' | 'import'
export type IncomeFrequency = 'one_time' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'wallet' | 'other'
export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'
export type SavingsGoalStatus = 'active' | 'completed' | 'abandoned'
export type InsightType =
  | 'spending_pattern'
  | 'budget_alert'
  | 'saving_tip'
  | 'subscription_alert'
  | 'prediction'
export type InsightSeverity = 'info' | 'warning' | 'critical'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  preferred_currency: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  kind: CategoryKind
  icon: string
  color: string
  is_system: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  kind: TransactionKind
  merchant: string
  amount: number
  currency: string
  note: string | null
  source: TransactionSource
  raw_transcript: string | null
  occurred_at: string
  created_at: string
  updated_at: string
  category?: Category | null
}

export interface IncomeEntry {
  id: string
  user_id: string
  transaction_id: string | null
  category_id: string | null
  source_name: string
  amount: number
  currency: string
  frequency: IncomeFrequency
  received_at: string
  next_expected_date: string | null
  created_at: string
  updated_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  target_amount: number
  current_amount: number
  currency: string
  target_date: string | null
  status: SavingsGoalStatus
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  category_id: string | null
  detected_from_transaction_id: string | null
  merchant: string
  amount: number
  currency: string
  billing_cycle: BillingCycle
  status: SubscriptionStatus
  next_renewal_date: string | null
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  theme: 'dark' | 'light' | 'system'
  default_voice_language: string
  notifications_enabled: boolean
  budget_alerts_enabled: boolean
  weekly_summary_enabled: boolean
  biometric_lock_enabled: boolean
  created_at: string
  updated_at: string
}

export interface AiInsight {
  id: string
  user_id: string
  related_category_id: string | null
  related_transaction_id: string | null
  insight_type: InsightType
  severity: InsightSeverity
  title: string
  message: string
  is_read: boolean
  created_at: string
}
