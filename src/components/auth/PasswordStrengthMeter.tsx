import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { getPasswordStrength } from '../../utils/authSchemas'

interface PasswordStrengthMeterProps {
  password: string
}

const requirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
]

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null

  const { score, label, color } = getPasswordStrength(password)
  const segments = 5

  return (
    <div className="flex flex-col gap-3 -mt-1">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-white/[0.08] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: i < score ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
        <span className="text-xs font-semibold" style={{ color }}>
          {label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {requirements.map((req) => {
          const passed = req.test(password)
          return (
            <div key={req.label} className="flex items-center gap-1.5 text-xs">
              {passed ? (
                <Check className="w-3.5 h-3.5 text-mint flex-shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-ink-700 flex-shrink-0" />
              )}
              <span className={passed ? 'text-ink-300' : 'text-ink-500'}>{req.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
