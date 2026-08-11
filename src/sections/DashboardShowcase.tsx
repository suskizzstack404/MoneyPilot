import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, CreditCard, Sparkles } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import AnimatedLineChart from '../components/AnimatedLineChart'
import AnimatedPieChart from '../components/AnimatedPieChart'
import { transactions } from '../constants/data'

const monthlySpend = [32, 45, 38, 52, 47, 61, 55, 68, 59, 71, 64, 78]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const statCards = [
  { label: 'Total Balance', value: '₹5,78,395', delta: '+8.2%', up: true, icon: Wallet },
  { label: 'This Month Spend', value: '₹42,180', delta: '+15.4%', up: false, icon: CreditCard },
  { label: 'Savings Rate', value: '31%', delta: '+4.1%', up: true, icon: PiggyBank },
]

export default function DashboardShowcase() {
  return (
    <section className="relative py-28 px-6 lg:px-10">
      <div className="absolute inset-0 bg-grid-glow opacity-60 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="flex justify-center">
            <SectionLabel>Your Dashboard</SectionLabel>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink-100 leading-tight">
            One view. Every rupee accounted for.
          </h2>
          <p className="mt-5 text-ink-300 text-lg leading-relaxed">
            A live financial command center, built from the sentences you speak.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <GlassCard className="p-6 lg:p-8">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {statCards.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-slate-50 border border-slate-200 p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-9 h-9 rounded-lg bg-emerald/10 border border-mint/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-mint" />
                      </span>
                      <span
                        className={`flex items-center gap-0.5 text-xs font-semibold ${
                          stat.up ? 'text-mint' : 'text-rose-500'
                        }`}
                      >
                        {stat.up ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {stat.delta}
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-ink-100 font-display">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-ink-100">Yearly Spending</p>
                    <p className="text-xs text-ink-500 mt-0.5">Jan – Dec 2026</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-500">
                    <span className="w-2 h-2 rounded-full bg-mint" /> Spend
                  </div>
                </div>
                <AnimatedLineChart data={monthlySpend} width={640} height={200} className="w-full" />
                <div className="flex justify-between mt-2 px-1">
                  {months.map((m) => (
                    <span key={m} className="text-[10px] text-ink-500">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-100 mb-4">Spending by Category</p>
                  <AnimatedPieChart
                    size={110}
                    data={[
                      { label: 'Food', value: 38, color: '#22C55E' },
                      { label: 'Bills', value: 27, color: '#3B82F6' },
                      { label: 'Transport', value: 18, color: '#16A34A' },
                      { label: 'Other', value: 17, color: '#4ADE80' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6">
                <p className="text-sm font-semibold text-ink-100 mb-4">Recent Transactions</p>
                <div className="flex flex-col gap-4">
                  {transactions.map((t) => (
                    <div key={t.merchant} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-ink-100">{t.merchant}</p>
                        <p className="text-xs text-ink-500">
                          {t.category} · {t.time}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold ${
                          t.amount < 0 ? 'text-ink-100' : 'text-mint'
                        }`}
                      >
                        {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-emerald/10 to-teal/5 border border-mint/20 p-6 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-mint" />
                  <p className="text-sm font-semibold text-ink-100">AI Insight</p>
                </div>
                <p className="text-sm text-ink-300 leading-relaxed">
                  You spent 15% more on dining this month compared to your 3-month average.
                  Cooking two more meals at home could save you roughly ₹3,200.
                </p>
                <button className="text-xs font-semibold text-mint mt-4 self-start hover:underline">
                  View full breakdown →
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
