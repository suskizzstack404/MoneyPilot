import { motion } from 'framer-motion'
import { Waves, TrendingUp, Sparkles, PiggyBank } from 'lucide-react'
import GlassCard from '../GlassCard'
import VoiceOrb from '../VoiceOrb'
import AnimatedLineChart from '../AnimatedLineChart'

const spendData = [42, 58, 39, 65, 51, 74, 60, 82]

export default function BrandingPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full overflow-hidden px-14 py-14 border-r border-slate-200">
      <div className="absolute inset-0 bg-grid-glow pointer-events-none" />
      <div className="absolute -top-32 -left-20 w-[500px] h-[500px] bg-emerald/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal/10 blur-[110px] rounded-full pointer-events-none" />

      <motion.a
        href="/"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex items-center gap-2 font-display font-bold text-lg text-ink-100"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-mint-emerald">
          <Waves className="w-[18px] h-[18px] text-[#FFFFFF]" strokeWidth={2.5} />
        </span>
        MoneyPilot
      </motion.a>

      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl xl:text-[2.75rem] font-bold leading-[1.1] text-ink-100 max-w-md"
        >
          Control Your Money.
          <br />
          <span className="text-gradient">Just Use Your Voice.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 text-ink-300 leading-relaxed max-w-sm"
        >
          Sign in to keep tracking expenses, subscriptions, and budgets the moment you speak them.
        </motion.p>
      </div>

      <div className="relative z-10 flex-1 flex items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-sm mx-auto"
        >
          <GlassCard className="p-6 animate-float">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-ink-500">Current Balance</p>
                <p className="text-2xl font-bold text-ink-100 font-display mt-1">₹5,78,395</p>
              </div>
              <VoiceOrb size="sm" />
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-ink-500 mb-2">Spending Trend</p>
              <AnimatedLineChart data={spendData} height={80} className="w-full" />
            </div>
          </GlassCard>

          <motion.div
            className="absolute -left-12 -top-6 hidden xl:block"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >
            <GlassCard className="p-3.5 w-40 shadow-glow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <PiggyBank className="w-3.5 h-3.5 text-mint" />
                <p className="text-[11px] text-ink-500">Savings</p>
              </div>
              <p className="text-base font-bold text-ink-100">₹28,450</p>
            </GlassCard>
          </motion.div>

          <motion.div
            className="absolute -right-10 -bottom-8 hidden xl:block"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          >
            <GlassCard className="p-3.5 w-48 shadow-glow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal" />
                <p className="text-[11px] text-ink-500">AI Insight</p>
              </div>
              <p className="text-xs text-ink-100 leading-snug">
                Dining spend is 15% above your usual pace.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 flex items-center gap-2 text-xs text-ink-500"
      >
        <TrendingUp className="w-3.5 h-3.5 text-mint" />
        Trusted by thousands managing money by voice
      </motion.div>
    </div>
  )
}
