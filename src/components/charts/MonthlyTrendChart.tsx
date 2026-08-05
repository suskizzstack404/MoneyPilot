import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { MonthlyPoint } from '../../utils/financeCalculations'

function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const value = payload[0].value as number
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="text-ink-300 mb-0.5">{label}</p>
      <p className={`font-semibold ${value >= 0 ? 'text-mint' : 'text-rose-400'}`}>
        {value < 0 ? '-' : ''}₹{Math.abs(value).toLocaleString('en-IN')}
      </p>
    </div>
  )
}

export default function MonthlyTrendChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="netTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#7C8798', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#7C8798', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v >= 1000 || v <= -1000 ? `${Math.round(v / 1000)}k` : v}`}
        />
        <Tooltip content={<TrendTooltip />} />
        <Area
          type="monotone"
          dataKey="net"
          stroke="#34D399"
          strokeWidth={2.5}
          fill="url(#netTrendFill)"
          isAnimationActive
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
