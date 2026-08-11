import { motion } from 'framer-motion'
import { ArrowRight, Play, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'
import Button from '../components/Button'
import GlassCard from '../components/GlassCard'
import VoiceOrb from '../components/VoiceOrb'
import AnimatedLineChart from '../components/AnimatedLineChart'
import AnimatedPieChart from '../components/AnimatedPieChart'
import AnimatedCounter from '../components/AnimatedCounter'
import { transactions } from '../constants/data'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const spendData = [42, 58, 39, 65, 51, 74, 60, 82]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative pt-40 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-glow pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-wide text-mint uppercase mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-glow" />
            Voice-first finance
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-[3.6rem] xl:text-7xl font-bold leading-[1.05] text-ink-100"
          >
            Control Your Money.
            <br />
            <span className="text-gradient">Just Use Your Voice.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 text-lg text-ink-300 leading-relaxed max-w-lg">
            Manage expenses, subscriptions, budgets and AI financial insights
            using natural conversations. No forms, no spreadsheets.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4 mt-9">
            <Button size="lg" to="/signup" icon={<ArrowRight className="w-4 h-4" />}>
              Start Free
            </Button>
            <Button size="lg" variant="secondary" href="#demo" icon={<Play className="w-4 h-4" />}>
              Watch Demo
            </Button>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-8 mt-12">
            <div>
              <div className="text-2xl font-bold text-ink-100 font-display">
                <AnimatedCounter value={2.4} decimals={1} suffix="M+" />
              </div>
              <div className="text-xs text-ink-500 mt-1">Expenses logged by voice</div>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div>
              <div className="text-2xl font-bold text-ink-100 font-display">
                <AnimatedCounter value={98.6} decimals={1} suffix="%" />
              </div>
              <div className="text-xs text-ink-500 mt-1">Categorization accuracy</div>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div>
              <div className="text-2xl font-bold text-ink-100 font-display">
                <AnimatedCounter value={40} suffix="+" />
              </div>
              <div className="text-xs text-ink-500 mt-1">Currencies supported</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-mint-emerald opacity-[0.08] blur-[80px] rounded-full" />

          {/* Main dashboard card */}
          <GlassCard className="relative p-6 animate-float">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-ink-500">Current Balance</p>
                <p className="text-3xl font-bold text-ink-100 font-display mt-1">₹5,78,395</p>
              </div>
              <VoiceOrb size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-ink-500">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Monthly Spending
                </div>
                <p className="text-lg font-semibold text-ink-100 mt-1.5">₹42,180</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-ink-500">
                  <TrendingUp className="w-3.5 h-3.5 text-mint" /> Income
                </div>
                <p className="text-lg font-semibold text-ink-100 mt-1.5">₹92,000</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-4">
              <p className="text-xs text-ink-500 mb-2">Spending Trend</p>
              <AnimatedLineChart data={spendData} height={90} className="w-full" />
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-ink-500 mb-3">Recent Transactions</p>
              <div className="flex flex-col gap-3">
                {transactions.slice(0, 2).map((t) => (
                  <div key={t.merchant} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink-100">{t.merchant}</p>
                      <p className="text-xs text-ink-500">{t.category}</p>
                    </div>
                    <p className={`text-sm font-semibold ${t.amount < 0 ? 'text-ink-100' : 'text-mint'}`}>
                      {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Floating savings card */}
          <motion.div
            className="absolute -left-10 top-16 hidden md:block"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <GlassCard className="p-4 w-48 shadow-glow-sm">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="w-4 h-4 text-mint" />
                <p className="text-xs text-ink-500">Savings</p>
              </div>
              <p className="text-xl font-bold text-ink-100">₹28,450</p>
              <p className="text-xs text-mint mt-1">+12% this month</p>
            </GlassCard>
          </motion.div>

          {/* Floating AI insight card */}
          <motion.div
            className="absolute -right-6 bottom-4 hidden md:block"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <GlassCard className="p-4 w-56 shadow-glow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-teal" />
                <p className="text-xs text-ink-500">AI Insight</p>
              </div>
              <p className="text-sm text-ink-100 leading-snug">
                Dining spend is 15% above your usual pace this month.
              </p>
            </GlassCard>
          </motion.div>

          {/* Floating pie chart */}
          <motion.div
            className="absolute -bottom-10 left-1/3 hidden lg:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            <GlassCard className="p-4 shadow-glow-sm">
              <p className="text-xs text-ink-500 mb-2">Spending by Category</p>
              <AnimatedPieChart
                size={90}
                data={[
                  { label: 'Food', value: 40, color: '#22C55E' },
                  { label: 'Bills', value: 30, color: '#3B82F6' },
                  { label: 'Other', value: 30, color: '#16A34A' },
                ]}
              />
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
