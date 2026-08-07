import { useCallback } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  sendPasswordResetEmail,
  updatePassword,
  signOut as signOutService,
} from '../services/authService'

export function useAuth() {
  const { session, user, isLoading, isAuthenticated } = useAuthContext()

  const login = useCallback((email: string, password: string) => signInWithEmail(email, password), [])

  const register = useCallback(
    (fullName: string, email: string, password: string) => signUpWithEmail(fullName, email, password),
    []
  )

  const loginWithGoogle = useCallback(() => signInWithGoogle(), [])

  const requestPasswordReset = useCallback((email: string) => sendPasswordResetEmail(email), [])

  const resetPassword = useCallback((newPassword: string) => updatePassword(newPassword), [])

  const logout = useCallback(() => signOutService(), [])

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    requestPasswordReset,
    resetPassword,
    logout,
  }
}
