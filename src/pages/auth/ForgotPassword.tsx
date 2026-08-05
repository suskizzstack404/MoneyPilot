import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, MailCheck } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import FormField from '../../components/auth/FormField'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../utils/authSchemas'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true)
    const { error } = await requestPasswordReset(values.email)
    setIsSubmitting(false)

    if (error) {
      showToast(error, 'error')
      return
    }

    setSentTo(values.email)
  }

  if (sentTo) {
    return (
      <AuthLayout title="Check your inbox" description="We've sent you a password reset link.">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-5 py-2"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-emerald/10 border border-mint/25 flex items-center justify-center"
          >
            <MailCheck className="w-7 h-7 text-mint" />
          </motion.div>
          <p className="text-sm text-ink-300 leading-relaxed max-w-xs">
            A reset link was sent to <span className="text-ink-100 font-medium">{sentTo}</span>.
            Follow the link to choose a new password.
          </p>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setSentTo(null)}
          >
            Use a different email
          </Button>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mint hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" size="lg" className="w-full mt-1" isLoading={isSubmitting}>
          Send Reset Link
        </Button>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-ink-300 hover:text-ink-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </form>
    </AuthLayout>
  )
}
