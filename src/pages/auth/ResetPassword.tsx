import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordField from '../../components/auth/PasswordField'
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../../utils/authSchemas'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = watch('password')

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true)
    const { error } = await resetPassword(values.password)
    setIsSubmitting(false)

    if (error) {
      showToast(error, 'error')
      return
    }

    setIsDone(true)
  }

  if (isDone) {
    return (
      <AuthLayout title="Password updated" description="You're all set with your new password.">
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
            <CheckCircle2 className="w-7 h-7 text-mint" />
          </motion.div>
          <p className="text-sm text-ink-300 leading-relaxed max-w-xs">
            Your password has been changed successfully. Sign in with your new password to
            continue.
          </p>
          <Button
            size="lg"
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/login', { replace: true })}
          >
            Back to Sign In
          </Button>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Set a new password"
      description="Choose a strong password you haven't used before."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <PasswordField
            label="New Password"
            autoComplete="new-password"
            placeholder="Create a new password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrengthMeter password={password ?? ''} />
        </div>

        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" className="w-full mt-1" isLoading={isSubmitting}>
          Update Password
        </Button>

        <p className="text-center text-sm text-ink-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-mint hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
