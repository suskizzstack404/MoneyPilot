import { motion } from 'framer-motion'
import { Wallet, Calendar } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import { ListSkeleton, ErrorState, EmptyState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'

const frequencyLabel: Record<string, string> = {
  one_time: 'One-time',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

export default function IncomePage() {
  const { income, isLoading, error, refetch } = useDashboardDataContext()
  const total = income.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Income</h1>
        <p className="text-sm text-ink-500 mt-1">
          Structured income sources — salary, freelance, investments.
        </p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading ? (
        <ListSkeleton rows={5} />
      ) : income.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<Wallet className="w-5 h-5" />}
            title="No income logged yet"
            description="Speak or log your salary and other income sources to see them tracked here."
          />
        </GlassCard>
      ) : (
        <GlassCard className="p-5 sm:p-6">
          <p className="text-xs text-ink-500 mb-4">
            Total tracked income:{' '}
            <span className="text-ink-100 font-semibold">₹{total.toLocaleString('en-IN')}</span>
          </p>
          <div className="flex flex-col gap-3">
            {income.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3.5 rounded-xl bg-slate-50 border border-slate-200 p-4"
              >
                <span className="w-10 h-10 rounded-xl bg-mint-emerald/10 border border-mint/20 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-mint" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-100 truncate">{entry.source_name}</p>
                  <p className="text-xs text-ink-500 mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {frequencyLabel[entry.frequency]} ·{' '}
                    {new Date(entry.received_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <p className="text-sm font-semibold text-mint flex-shrink-0">
                  +₹{entry.amount.toLocaleString('en-IN')}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
