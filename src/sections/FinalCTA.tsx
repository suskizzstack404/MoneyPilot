import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import VoiceOrb from '../components/VoiceOrb'

export default function FinalCTA() {
  return (
    <section className="relative py-24 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative rounded-3xl glass p-12 lg:p-16 text-center overflow-hidden"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-mint-emerald opacity-[0.12] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative flex justify-center mb-7">
            <VoiceOrb size="lg" />
          </div>

          <h2 className="relative text-4xl lg:text-5xl font-bold text-ink-100 leading-tight max-w-2xl mx-auto">
            Start Managing Money Smarter.
          </h2>
          <p className="relative mt-5 text-ink-300 text-lg max-w-lg mx-auto leading-relaxed">
            Join thousands who've replaced spreadsheets with a single sentence.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-4 mt-9">
            <Button size="lg" to="/signup" icon={<ArrowRight className="w-4 h-4" />}>
              Start Free
            </Button>
            <Button size="lg" variant="secondary" href="mailto:sales@moneypilot.app">
              Talk to Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
