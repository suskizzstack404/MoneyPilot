import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import Button from '../components/Button'
import { pricingPlans } from '../constants/data'

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="flex justify-center">
            <SectionLabel>Pricing</SectionLabel>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink-100 leading-tight">
            Simple pricing. No hidden fees.
          </h2>
          <p className="mt-5 text-ink-300 text-lg leading-relaxed">
            Start free. Upgrade when you want the full financial picture.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
            >
              <GlassCard
                className={`p-8 h-full relative overflow-hidden ${
                  plan.highlighted ? 'border-mint/40 shadow-glow-sm' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-mint-emerald text-[#FFFFFF] text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wide uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-ink-100 font-display mb-1">{plan.name}</h3>
                <p className="text-sm text-ink-500 mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-7">
                  <span className="text-4xl font-bold text-ink-100 font-display">{plan.price}</span>
                  <span className="text-ink-500 text-sm">{plan.period}</span>
                </div>
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full mb-7"
                  size="md"
                  to="/signup"
                >
                  {plan.cta}
                </Button>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-300">
                      <Check className="w-4 h-4 text-mint mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
