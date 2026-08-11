import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ChevronDown } from 'lucide-react'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  icon?: ReactNode
  children: ReactNode
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, icon, id, className = '', children, ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-ink-300">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none z-10">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={`w-full appearance-none rounded-xl bg-slate-50 border ${
              error ? 'border-rose-400/60' : 'border-slate-200'
            } px-4 py-3 text-sm text-ink-100 outline-none transition-all duration-200 focus:border-mint/50 focus:bg-slate-50 focus:shadow-glow-sm cursor-pointer ${
              icon ? 'pl-11' : ''
            } pr-10 ${className}`}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              id={`${fieldId}-error`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 text-xs text-rose-500"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'

export default SelectField
