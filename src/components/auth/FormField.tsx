import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
  rightSlot?: ReactNode
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, rightSlot, id, className = '', ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-ink-300">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={`w-full rounded-xl bg-slate-50 border ${
              error ? 'border-rose-400/60' : 'border-slate-200'
            } px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-all duration-200 focus:border-mint/50 focus:bg-slate-50 focus:shadow-glow-sm ${
              icon ? 'pl-11' : ''
            } ${rightSlot ? 'pr-11' : ''} ${className}`}
            {...rest}
          />
          {rightSlot && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>
          )}
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

FormField.displayName = 'FormField'

export default FormField
