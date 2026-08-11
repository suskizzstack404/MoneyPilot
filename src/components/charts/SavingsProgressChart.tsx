import { motion } from 'framer-motion'
import type { SavingsGoal } from '../../types/database'

export default function SavingsProgressChart({ goals }: { goals: SavingsGoal[] }) {
  return (
    <div className="flex flex-col gap-5">
      {goals.map((goal, i) => {
        const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
        return (
          <div key={goal.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-ink-100">{goal.name}</span>
              <span className="text-xs text-ink-500">
                ₹{goal.current_amount.toLocaleString('en-IN')} / ₹
                {goal.target_amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: goal.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
