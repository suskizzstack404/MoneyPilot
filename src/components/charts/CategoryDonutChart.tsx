import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { CategorySlice } from '../../utils/financeCalculations'

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p style={{ color: p.payload.color }} className="font-semibold">
        {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
      </p>
    </div>
  )
}

export default function CategoryDonutChart({ data }: { data: CategorySlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex items-center gap-6">
      <div className="w-[150px] h-[150px] flex-shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={3}
              isAnimationActive
              animationDuration={900}
            >
              {data.map((slice, i) => (
                <Cell key={i} fill={slice.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] text-ink-500">Total</p>
          <p className="text-sm font-bold text-ink-100">₹{total.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 min-w-0">
        {data.map((slice) => (
          <div key={slice.label} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-ink-300 truncate flex-1">{slice.label}</span>
            <span className="text-ink-100 font-semibold flex-shrink-0">
              {total > 0 ? Math.round((slice.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
