import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Sparkles } from 'lucide-react'
import GlassCard from '../GlassCard'

type VoiceState = 'idle' | 'listening' | 'processing' | 'responded'

const barHeights = [0.35, 0.65, 1, 0.5, 0.8, 0.4, 0.9, 0.55, 0.7, 0.3]

export default function VoiceAssistantWidget() {
  const [state, setState] = useState<VoiceState>('idle')
  const [lastCommand, setLastCommand] = useState<string | null>(null)

  const handleMicClick = () => {
    if (state === 'listening') {
      setState('processing')
      setTimeout(() => {
        setLastCommand('I spent ₹450 on groceries')
        setState('responded')
      }, 1400)
      return
    }
    setState('listening')
  }

  const statusCopy: Record<VoiceState, string> = {
    idle: 'Tap the mic and say an expense out loud.',
    listening: 'Listening…',
    processing: 'Parsing what you said…',
    responded: 'Logged and categorized.',
  }

  return (
    <GlassCard className="p-6 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-ink-100">Voice Assistant</p>
          <p className="text-xs text-ink-500 mt-0.5">Speak an expense, MoneyPilot logs it</p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            state === 'listening'
              ? 'bg-mint/10 text-mint'
              : state === 'processing'
                ? 'bg-teal/10 text-teal'
                : 'bg-white/[0.05] text-ink-500'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              state === 'idle' ? 'bg-ink-500' : 'bg-current animate-pulse-glow'
            }`}
          />
          {state === 'idle' ? 'Ready' : state === 'listening' ? 'Listening' : state === 'processing' ? 'Thinking' : 'Done'}
        </span>
      </div>

      <div className="relative flex flex-col items-center py-4">
        <button
          onClick={handleMicClick}
          disabled={state === 'processing'}
          className="relative w-20 h-20 flex items-center justify-center disabled:cursor-wait"
          aria-label={state === 'listening' ? 'Stop listening' : 'Start voice command'}
        >
          <span
            className={`absolute inset-0 rounded-full bg-mint-emerald blur-lg transition-opacity duration-300 ${
              state === 'listening' ? 'opacity-40' : 'opacity-15'
            }`}
          />
          {state === 'listening' && (
            <motion.span
              className="absolute inset-0 rounded-full border border-mint/40"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-mint-emerald shadow-glow-sm">
            {state === 'listening' ? (
              <div className="flex items-end gap-[3px] h-1/2">
                {barHeights.map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-[#04140D] animate-wave"
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
            ) : (
              <Mic className="w-8 h-8 text-[#04140D]" strokeWidth={2} />
            )}
          </div>
        </button>

        <p className="text-xs text-ink-500 mt-4 text-center min-h-[16px]">{statusCopy[state]}</p>
      </div>

      <AnimatePresence>
        {lastCommand && state === 'responded' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mt-2"
          >
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5 mb-2.5">
              <p className="text-[11px] text-ink-500 mb-1">You said</p>
              <p className="text-sm text-ink-100">"{lastCommand}"</p>
            </div>
            <div className="rounded-xl bg-emerald/[0.06] border border-mint/20 p-3.5 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
              <p className="text-sm text-ink-100 leading-snug">
                Logged ₹450 to <span className="text-mint font-medium">Food &amp; Dining</span>.
                That's your 3rd grocery run this week.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state === 'responded' && (
        <button
          onClick={() => {
            setState('idle')
            setLastCommand(null)
          }}
          className="w-full text-center text-xs text-ink-500 hover:text-ink-100 mt-3 transition-colors duration-200"
        >
          Log another expense
        </button>
      )}
    </GlassCard>
  )
}
