import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import type { MonthlyPoint } from '../../utils/financeCalculations'

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="text-ink-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

export default function IncomeExpenseChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#64748B', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#475569' }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="income" name="Income" fill="#22C55E" radius={[6, 6, 0, 0]} maxBarSize={22} />
        <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}
