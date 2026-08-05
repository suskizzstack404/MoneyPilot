import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import AnimatedCounter from '../AnimatedCounter'
import GlassCard from '../GlassCard'

interface StatCardProps {
  label: string
  value: number
  currencySymbol?: string
  change?: number
  /** For metrics like expenses, a negative change is good news — flips color only, not arrow direction. */
  invertSentiment?: boolean
  icon: ReactNode
  sparkline?: number[]
  accent?: 'mint' | 'rose' | 'teal'
  delay?: number
}

export default function StatCard({
  label,
  value,
  currencySymbol = '₹',
  change,
  invertSentiment = false,
  icon,
  sparkline,
  accent = 'mint',
  delay = 0,
}: StatCardProps) {
  const isNegativeValue = value < 0
  const isIncrease = (change ?? 0) >= 0
  const isGoodChange = invertSentiment ? !isIncrease : isIncrease

  const accentColor = accent === 'rose' ? '#F87171' : accent === 'teal' ? '#2DD4BF' : '#34D399'
  const sparkData = (sparkline ?? []).map((v, i) => ({ i, v }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <GlassCard hover className="p-5 sm:p-6 h-full relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: `${accentColor}1A`,
              borderColor: `${accentColor}40`,
              color: accentColor,
            }}
          >
            {icon}
          </span>
          {change !== undefined && (
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                isGoodChange ? 'text-mint' : 'text-rose-400'
              }`}
            >
              {isIncrease ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
        </div>

        <p className="text-xs text-ink-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-ink-100 font-display">
          {isNegativeValue ? '-' : ''}
          {currencySymbol}
          <AnimatedCounter value={Math.abs(value)} />
        </p>

        {sparkData.length > 1 && (
          <div className="h-10 -mx-1 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accentColor} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={accentColor}
                  strokeWidth={2}
                  fill={`url(#spark-${label})`}
                  isAnimationActive
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}
