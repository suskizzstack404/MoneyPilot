import { motion } from 'framer-motion'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import { features } from '../constants/data'

export default function Features() {
  return (
    <section id="features" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="flex justify-center">
            <SectionLabel>Features</SectionLabel>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink-100 leading-tight">
            Everything a ledger does.
            <br />
            None of the typing.
          </h2>
          <p className="mt-5 text-ink-300 text-lg leading-relaxed">
            MoneyPilot turns spoken sentences into structured, analyzed, categorized financial data — instantly.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: 'easeOut' }}
              >
                <GlassCard hover className="p-7 h-full">
                  <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-mint/20 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-mint" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-ink-100 mb-2 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-ink-300 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
