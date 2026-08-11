import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicOnlyRoute from './components/auth/PublicOnlyRoute'
import SessionLoader from './components/auth/SessionLoader'

// Dashboard pulls in Recharts and is only needed once a user is authenticated,
// so it's code-split out of the initial landing/auth bundle.
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'))
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'))
const TransactionsPage = lazy(() => import('./pages/dashboard/TransactionsPage'))
const IncomePage = lazy(() => import('./pages/dashboard/IncomePage'))
const ExpensesPage = lazy(() => import('./pages/dashboard/ExpensesPage'))
const SubscriptionsPage = lazy(() => import('./pages/dashboard/SubscriptionsPage'))
const SavingsGoalsPage = lazy(() => import('./pages/dashboard/SavingsGoalsPage'))
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'))
const AIAssistantPage = lazy(() => import('./pages/dashboard/AIAssistantPage'))
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <SignIn />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignUp />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        }
      />
      {/* Reset password is reached via an emailed link while in a temporary recovery
          session, so it intentionally is not wrapped in PublicOnlyRoute. */}
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<SessionLoader />}>
              <DashboardLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="income" element={<IncomePage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="savings-goals" element={<SavingsGoalsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
