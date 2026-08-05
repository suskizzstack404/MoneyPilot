import { supabase } from '../lib/supabase/client'
import type { AuthError, Session, User } from '@supabase/supabase-js'

export interface AuthResult<T = void> {
  data: T | null
  error: string | null
}

function normalizeError(error: AuthError | Error | null): string | null {
  if (!error) return null
  const message = error.message ?? 'Something went wrong. Please try again.'
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'Incorrect email or password.'
  }
  if (message.toLowerCase().includes('user already registered')) {
    return 'An account with this email already exists.'
  }
  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Please verify your email before signing in.'
  }
  return message
}

export async function signUpWithEmail(
  fullName: string,
  email: string,
  password: string
): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  })

  return { data, error: normalizeError(error) }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error: normalizeError(error) }
}

export async function signInWithGoogle(): Promise<AuthResult<{ url: string | null }>> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
  return { data, error: normalizeError(error) }
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data: null, error: normalizeError(error) }
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { data: null, error: normalizeError(error) }
}

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut()
  return { data: null, error: normalizeError(error) }
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  return data.session
}
