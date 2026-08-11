import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import FormField from './FormField'

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, id, ...rest }, ref) => {
    const [visible, setVisible] = useState(false)
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <FormField
        ref={ref}
        id={fieldId}
        label={label}
        error={error}
        type={visible ? 'text' : 'password'}
        icon={<Lock className="w-4 h-4" />}
        rightSlot={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="text-ink-500 hover:text-ink-100 transition-colors duration-200"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        {...rest}
      />
    )
  }
)

PasswordField.displayName = 'PasswordField'

export default PasswordField
