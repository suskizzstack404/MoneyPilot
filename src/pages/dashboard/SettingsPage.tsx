import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, ShieldCheck, Mic } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import Button from '../../components/Button'
import FormField from '../../components/auth/FormField'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'
import { updateProfile, updateUserPreferences } from '../../services/dashboardService'
import { ErrorState, ListSkeleton } from '../../components/dashboard/StateViews'

const currencies = ['INR', 'USD', 'EUR', 'GBP']
const languages = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'hi-IN', label: 'Hindi' },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? 'bg-mint-emerald' : 'bg-slate-200'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
        style={{ left: checked ? 18 : 2 }}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { profile, preferences, isLoading, error, refetch } = useDashboardDataContext()

  const [fullName, setFullName] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(true)
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPrefs, setIsSavingPrefs] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setCurrency(profile.preferred_currency)
    }
    if (preferences) {
      setVoiceLanguage(preferences.default_voice_language)
      setNotificationsEnabled(preferences.notifications_enabled)
      setBudgetAlertsEnabled(preferences.budget_alerts_enabled)
      setWeeklySummaryEnabled(preferences.weekly_summary_enabled)
    }
  }, [profile, preferences])

  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (isLoading) return <ListSkeleton rows={5} />

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSavingProfile(true)
    try {
      await updateProfile(user.id, { full_name: fullName, preferred_currency: currency })
      showToast('Profile updated.', 'success')
      refetch()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile.', 'error')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSavePreferences = async () => {
    if (!user) return
    setIsSavingPrefs(true)
    try {
      await updateUserPreferences(user.id, {
        default_voice_language: voiceLanguage,
        notifications_enabled: notificationsEnabled,
        budget_alerts_enabled: budgetAlertsEnabled,
        weekly_summary_enabled: weeklySummaryEnabled,
      })
      showToast('Preferences updated.', 'success')
      refetch()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update preferences.', 'error')
    } finally {
      setIsSavingPrefs(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">Settings</h1>
        <p className="text-sm text-ink-500 mt-1">Manage your profile, currency, and preferences.</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-mint" />
          <p className="text-sm font-semibold text-ink-100">Profile</p>
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-300">Preferred Currency</label>
            <div className="flex gap-2 flex-wrap">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                    currency === c
                      ? 'bg-slate-100 text-ink-100 border-mint/30'
                      : 'text-ink-500 border-slate-200 hover:text-ink-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Button
            size="md"
            className="self-start mt-1"
            isLoading={isSavingProfile}
            onClick={handleSaveProfile}
          >
            Save Profile
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Mic className="w-4 h-4 text-teal" />
          <p className="text-sm font-semibold text-ink-100">Voice</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-300">Default Voice Language</label>
          <div className="flex gap-2 flex-wrap">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setVoiceLanguage(l.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  voiceLanguage === l.code
                    ? 'bg-slate-100 text-ink-100 border-mint/30'
                    : 'text-ink-500 border-slate-200 hover:text-ink-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-mint" />
          <p className="text-sm font-semibold text-ink-100">Notifications</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-100">Push notifications</p>
              <p className="text-xs text-ink-500">Renewal reminders and alerts</p>
            </div>
            <Toggle checked={notificationsEnabled} onChange={setNotificationsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-100">Budget alerts</p>
              <p className="text-xs text-ink-500">Notify when nearing a budget limit</p>
            </div>
            <Toggle checked={budgetAlertsEnabled} onChange={setBudgetAlertsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-100">Weekly summary</p>
              <p className="text-xs text-ink-500">A recap of your spending every Monday</p>
            </div>
            <Toggle checked={weeklySummaryEnabled} onChange={setWeeklySummaryEnabled} />
          </div>
          <Button
            size="md"
            className="self-start mt-1"
            isLoading={isSavingPrefs}
            onClick={handleSavePreferences}
          >
            Save Preferences
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-ink-500" />
          <p className="text-sm font-semibold text-ink-100">Account</p>
        </div>
        <p className="text-xs text-ink-500">Signed in as {user?.email}</p>
      </GlassCard>
    </div>
  )
}
