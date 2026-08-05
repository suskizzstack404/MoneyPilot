import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Waves } from 'lucide-react'
import BrandingPanel from './BrandingPanel'
import GlassCard from '../GlassCard'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas font-body grid lg:grid-cols-2">
      <BrandingPanel />

      <div className="relative flex items-center justify-center px-6 py-12 sm:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-glow opacity-70 pointer-events-none lg:hidden" />

        <a
          href="/"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2 font-display font-bold text-base text-ink-100 z-10"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-mint-emerald">
            <Waves className="w-[14px] h-[14px] text-[#04140D]" strokeWidth={2.5} />
          </span>
          MoneyPilot
        </a>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md"
        >
          <GlassCard className="p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-100 font-display leading-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-ink-300 leading-relaxed">{description}</p>

            <div className="mt-8">{children}</div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
