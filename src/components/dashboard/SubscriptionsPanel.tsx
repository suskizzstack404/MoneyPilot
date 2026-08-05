import { motion } from 'framer-motion'
import { Repeat, Clock } from 'lucide-react'
import GlassCard from '../GlassCard'
import type { Subscription } from '../../types/database'

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const cycleLabel: Record<Subscription['billing_cycle'], string> = {
  weekly: '/wk',
  monthly: '/mo',
  quarterly: '/qtr',
  yearly: '/yr',
}

export default function SubscriptionsPanel({ subscriptions }: { subscriptions: Subscription[] }) {
  return (
    <div className="flex flex-col gap-3">
      {subscriptions.map((sub, i) => {
        const days = sub.next_renewal_date ? daysUntil(sub.next_renewal_date) : null
        const isUrgent = days !== null && days <= 3

        return (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
          >
            <GlassCard hover className="p-4 flex items-center gap-3.5">
              <span className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                <Repeat className="w-4 h-4 text-ink-300" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-100 truncate">{sub.merchant}</p>
                {sub.next_renewal_date && (
                  <p
                    className={`text-xs mt-0.5 flex items-center gap-1 ${
                      isUrgent ? 'text-amber-400' : 'text-ink-500'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {days === 0 ? 'Renews today' : `Renews in ${days} day${days === 1 ? '' : 's'}`}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-ink-100">
                  ₹{sub.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-ink-500">{cycleLabel[sub.billing_cycle]}</p>
              </div>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
