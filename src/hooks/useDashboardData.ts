import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import {
  fetchProfile,
  fetchCategories,
  fetchTransactions,
  fetchIncomeEntries,
  fetchSavingsGoals,
  fetchSubscriptions,
  fetchUserPreferences,
  subscribeToDashboardChanges,
} from '../services/dashboardService'
import type {
  Profile,
  Category,
  Transaction,
  IncomeEntry,
  SavingsGoal,
  Subscription,
  UserPreferences,
} from '../types/database'

export interface DashboardData {
  profile: Profile | null
  categories: Category[]
  transactions: Transaction[]
  income: IncomeEntry[]
  savingsGoals: SavingsGoal[]
  subscriptions: Subscription[]
  preferences: UserPreferences | null
}

const emptyData: DashboardData = {
  profile: null,
  categories: [],
  transactions: [],
  income: [],
  savingsGoals: [],
  subscriptions: [],
  preferences: null,
}

export function useDashboardData() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>(emptyData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)
  const isFirstLoad = useRef(true)

  const load = useCallback(async () => {
    if (!user) return
    if (isFirstLoad.current) setIsLoading(true)
    setError(null)

    try {
      const [profile, categories, transactions, income, savingsGoals, subscriptions, preferences] =
        await Promise.all([
          fetchProfile(user.id),
          fetchCategories(user.id),
          fetchTransactions(user.id, { limit: 200 }),
          fetchIncomeEntries(user.id),
          fetchSavingsGoals(user.id),
          fetchSubscriptions(user.id),
          fetchUserPreferences(user.id),
        ])

      setData({ profile, categories, transactions, income, savingsGoals, subscriptions, preferences })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
    } finally {
      setIsLoading(false)
      isFirstLoad.current = false
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load, refreshToken])

  // Realtime: refetch whenever the user's rows change in any dashboard table.
  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToDashboardChanges(user.id, () => {
      load()
    })
    return unsubscribe
  }, [user, load])

  const refetch = useCallback(() => setRefreshToken((t) => t + 1), [])

  return { ...data, isLoading, error, refetch }
}
