import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle, Info } from 'lucide-react'
import GlassCard from '../GlassCard'
import type { GeneratedInsight } from '../../utils/insights'

const severityStyles = {
  info: { icon: Sparkles, color: '#3B82F6', bg: 'bg-teal/10', border: 'border-teal/25' },
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'bg-amber-400/10', border: 'border-amber-400/25' },
  critical: { icon: AlertTriangle, color: '#EF4444', bg: 'bg-rose-400/10', border: 'border-rose-400/25' },
} as const

export default function AIInsightsPanel({ insights }: { insights: GeneratedInsight[] }) {
  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight, i) => {
        const style = severityStyles[insight.severity]
        const Icon = style.icon
        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
          >
            <GlassCard hover className={`p-4 flex items-start gap-3 ${style.border} border`}>
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}
              >
                <Icon className="w-4 h-4" style={{ color: style.color }} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-100">{insight.title}</p>
                <p className="text-xs text-ink-300 mt-0.5 leading-relaxed">{insight.message}</p>
              </div>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
