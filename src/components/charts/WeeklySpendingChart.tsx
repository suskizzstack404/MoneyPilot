import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { DayPoint } from '../../utils/financeCalculations'

function WeeklyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="text-ink-300 mb-0.5">{label}</p>
      <p className="text-mint font-semibold">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
    </div>
  )
}

export default function WeeklySpendingChart({ data }: { data: DayPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#7C8798', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <Tooltip content={<WeeklyTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar
          dataKey="amount"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
          fill="#2DD4BF"
          isAnimationActive
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
