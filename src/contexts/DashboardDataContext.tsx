import { createContext, useContext } from 'react'
import type { useDashboardData } from '../hooks/useDashboardData'

type DashboardDataValue = ReturnType<typeof useDashboardData>

export const DashboardDataContext = createContext<DashboardDataValue | undefined>(undefined)

export function useDashboardDataContext(): DashboardDataValue {
  const ctx = useContext(DashboardDataContext)
  if (!ctx) {
    throw new Error('useDashboardDataContext must be used within DashboardLayout')
  }
  return ctx
}
