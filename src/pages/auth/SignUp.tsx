import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import FormField from '../../components/auth/FormField'
import PasswordField from '../../components/auth/PasswordField'
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter'
import SocialButton from '../../components/auth/SocialButton'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { signUpSchema, type SignUpFormValues } from '../../utils/authSchemas'

export default function SignUp() {
  const { register: registerUser, loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })

  const password = watch('password')

  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true)
    const { error } = await registerUser(values.fullName, values.email, values.password)
    setIsSubmitting(false)

    if (error) {
      showToast(error, 'error')
      return
    }

    showToast('Account created! Check your email to verify your address.', 'success')
    navigate('/login', { replace: true })
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    const { error } = await loginWithGoogle()
    if (error) {
      showToast(error, 'error')
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start managing money with nothing but your voice."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <FormField
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="Jordan Rivera"
          icon={<User className="w-4 h-4" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-3">
          <PasswordField
            label="Password"
            autoComplete="new-password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrengthMeter password={password ?? ''} />
        </div>

        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full mt-1"
          isLoading={isSubmitting}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Create Account
        </Button>

        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-ink-500">OR</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <SocialButton
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
          label={isGoogleLoading ? 'Connecting…' : 'Continue with Google'}
        />

        <p className="text-center text-sm text-ink-500 mt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-mint hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
