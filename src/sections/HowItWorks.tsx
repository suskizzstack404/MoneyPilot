import { motion } from 'framer-motion'
import { Mic, Brain, TrendingUp } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import { howItWorks } from '../constants/data'

const icons = [Mic, Brain, TrendingUp]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="flex justify-center">
            <SectionLabel>How It Works</SectionLabel>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink-100 leading-tight">
            Three steps. Said out loud.
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6 md:gap-10">
          <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-mint/40 via-teal/40 to-mint/40" />

          {howItWorks.map((step, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
                className="relative"
              >
                <GlassCard hover className="p-7 text-center h-full">
                  <div className="relative w-16 h-16 mx-auto mb-5">
                    <span className="absolute inset-0 rounded-2xl bg-mint-emerald opacity-15 blur-lg" />
                    <div className="relative w-full h-full rounded-2xl bg-emerald/10 border border-mint/25 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-mint" strokeWidth={1.8} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-ink-500 tracking-widest uppercase mb-2">
                    Step {i + 1}
                  </p>
                  <h3 className="text-xl font-bold text-ink-100 mb-3 font-display">{step.title}</h3>
                  <p className="text-sm text-ink-300 leading-relaxed">{step.description}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
