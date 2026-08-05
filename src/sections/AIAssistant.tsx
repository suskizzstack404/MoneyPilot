import { motion } from 'framer-motion'
import { ArrowDown, Sparkles, Tag, LineChart as LineChartIcon, CheckCircle2 } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import VoiceOrb from '../components/VoiceOrb'

const flow = [
  {
    icon: CheckCircle2,
    title: 'Expense Added',
    detail: '₹900 · Burger King',
  },
  {
    icon: Tag,
    title: 'Food Category',
    detail: 'Auto-classified in 0.4s',
  },
  {
    icon: LineChartIcon,
    title: 'Updated Analytics',
    detail: 'Monthly dining chart refreshed',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendation',
    detail: 'You spent 15% more on dining this month.',
    highlight: true,
  },
]

export default function AIAssistant() {
  return (
    <section id="demo" className="relative py-28 px-6 lg:px-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="flex justify-center">
            <SectionLabel>AI Assistant</SectionLabel>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink-100 leading-tight">
            One sentence. A full financial update.
          </h2>
          <p className="mt-5 text-ink-300 text-lg leading-relaxed">
            Watch what happens the moment you speak an expense out loud.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <GlassCard className="px-6 py-4 flex items-center gap-4 max-w-md">
            <VoiceOrb size="sm" />
            <p className="text-base text-ink-100 font-medium leading-snug">
              "I spent ₹900 on Burger King."
            </p>
          </GlassCard>
        </motion.div>

        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5 text-mint" />
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {flow.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
              >
                <GlassCard
                  hover
                  className={`p-5 h-full ${
                    step.highlight ? 'border-mint/30 bg-emerald/[0.06]' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                      step.highlight
                        ? 'bg-emerald/20 border border-mint/30'
                        : 'bg-white/[0.04] border border-white/[0.08]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${step.highlight ? 'text-mint' : 'text-ink-300'}`} />
                  </div>
                  <p className="text-sm font-semibold text-ink-100 mb-1">{step.title}</p>
                  <p className="text-xs text-ink-500 leading-relaxed">{step.detail}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
