import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import FormField from '../../components/auth/FormField'
import PasswordField from '../../components/auth/PasswordField'
import SocialButton from '../../components/auth/SocialButton'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { signInSchema, type SignInFormValues } from '../../utils/authSchemas'

export default function SignIn() {
  const { login, loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const onSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true)
    const { error } = await login(values.email, values.password)
    setIsSubmitting(false)

    if (error) {
      showToast(error, 'error')
      return
    }

    showToast('Welcome back!', 'success')
    navigate(redirectTo, { replace: true })
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    const { error } = await loginWithGoogle()
    if (error) {
      showToast(error, 'error')
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to keep managing your money by voice."
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

        <div>
          <PasswordField
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 text-sm text-ink-300 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/[0.03] accent-emerald cursor-pointer"
                {...register('rememberMe')}
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-mint hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-1"
          isLoading={isSubmitting}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>

        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-ink-500">OR</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <SocialButton
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          label={isGoogleLoading ? 'Connecting…' : 'Continue with Google'}
        />

        <p className="text-center text-sm text-ink-500 mt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-mint hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
