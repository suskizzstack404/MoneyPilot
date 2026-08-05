import { motion } from 'framer-motion'
import { trustedBy } from '../constants/data'

export default function TrustedBy() {
  const loop = [...trustedBy, ...trustedBy]

  return (
    <section className="relative py-14 px-6 lg:px-10 border-y border-white/[0.05]">
      <p className="text-center text-xs uppercase tracking-widest text-ink-500 mb-8">
        Trusted by finance teams who talk more than they type
      </p>
      <div className="relative max-w-5xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          className="flex items-center gap-16 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {loop.map((name, i) => (
            <span
              key={i}
              className="text-xl font-display font-semibold text-ink-500/70 hover:text-ink-100 transition-colors duration-300 whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
