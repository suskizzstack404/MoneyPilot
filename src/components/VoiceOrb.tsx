import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

interface VoiceOrbProps {
  size?: 'sm' | 'lg'
  listening?: boolean
}

const barHeights = [0.4, 0.7, 1, 0.55, 0.85, 0.35, 0.9, 0.5]

export default function VoiceOrb({ size = 'lg', listening = true }: VoiceOrbProps) {
  const dim = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12'

  return (
    <div className={`relative ${dim} flex items-center justify-center`}>
      <span className="absolute inset-0 rounded-full bg-mint-emerald opacity-20 blur-xl animate-pulse-glow" />
      <span className="absolute inset-0 rounded-full border border-mint/30" />
      <motion.span
        className="absolute inset-0 rounded-full border border-mint/40"
        animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-mint-emerald shadow-glow-sm">
        {listening ? (
          <div className="flex items-end gap-[3px] h-1/2">
            {barHeights.map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-[#FFFFFF] animate-wave"
                style={{
                  height: `${h * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <Mic className="w-1/2 h-1/2 text-[#FFFFFF]" strokeWidth={2.2} />
        )}
      </div>
    </div>
  )
}
