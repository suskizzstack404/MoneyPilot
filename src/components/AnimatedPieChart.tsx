import { motion } from 'framer-motion'

interface Slice {
  label: string
  value: number
  color: string
}

interface AnimatedPieChartProps {
  data: Slice[]
  size?: number
}

export default function AnimatedPieChart({ data, size = 120 }: AnimatedPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = size / 2 - 12
  const circumference = 2 * Math.PI * radius
  let cumulative = 0

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
          fill="none"
        />
        {data.map((slice, i) => {
          const fraction = slice.value / total
          const dash = fraction * circumference
          const offset = cumulative * circumference
          cumulative += fraction
          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={slice.color}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              whileInView={{ strokeDasharray: `${dash} ${circumference - dash}` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
            />
          )
        })}
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((slice, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="text-ink-300">{slice.label}</span>
            <span className="text-ink-100 font-semibold">
              {Math.round((slice.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
