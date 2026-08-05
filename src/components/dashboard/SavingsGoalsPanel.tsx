import { motion } from 'framer-motion'
import { PiggyBank, Target, Plane, Home, Car, GraduationCap, Heart, Gift, type LucideIcon } from 'lucide-react'
import GlassCard from '../GlassCard'
import type { SavingsGoal } from '../../types/database'

const goalIconMap: Record<string, LucideIcon> = {
  'piggy-bank': PiggyBank,
  target: Target,
  plane: Plane,
  home: Home,
  car: Car,
  'graduation-cap': GraduationCap,
  heart: Heart,
  gift: Gift,
}

function resolveIcon(name: string): LucideIcon {
  return goalIconMap[name] ?? PiggyBank
}

export default function SavingsGoalsPanel({ goals }: { goals: SavingsGoal[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {goals.map((goal, i) => {
        const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
        const remaining = Math.max(0, goal.target_amount - goal.current_amount)
        const Icon = resolveIcon(goal.icon)

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
          >
            <GlassCard hover className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${goal.color}1A`, color: goal.color }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold text-ink-500">{pct}%</span>
              </div>

              <p className="text-sm font-semibold text-ink-100">{goal.name}</p>
              <p className="text-xs text-ink-500 mt-0.5">
                ₹{goal.current_amount.toLocaleString('en-IN')} of ₹
                {goal.target_amount.toLocaleString('en-IN')}
              </p>

              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mt-3">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: goal.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>

              <p className="text-[11px] text-ink-500 mt-2.5">
                ₹{remaining.toLocaleString('en-IN')} left
                {goal.target_date &&
                  ` · by ${new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
              </p>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
