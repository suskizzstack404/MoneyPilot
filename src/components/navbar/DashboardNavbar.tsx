import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import type { Profile } from '../../types/database'

const currencies = ['INR', 'USD', 'EUR', 'GBP']

interface DashboardNavbarProps {
  profile: Profile | null
  onOpenMobileSidebar: () => void
  unreadInsightsCount: number
}

export default function DashboardNavbar({
  profile,
  onOpenMobileSidebar,
  unreadInsightsCount,
}: DashboardNavbarProps) {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [currency, setCurrency] = useState(profile?.preferred_currency ?? 'INR')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
        setCurrencyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'there'
  const initials = displayName
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = async () => {
    await logout()
    showToast('You have been signed out.', 'info')
    navigate('/login', { replace: true })
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-30 glass border-b border-slate-200 px-4 sm:px-6 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden text-ink-300 hover:text-ink-100 flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold text-ink-100 truncate">
              Welcome back, {displayName.split(' ')[0]}
            </p>
            <p className="text-xs text-ink-500 hidden sm:block">
              Here's what's happening with your money today.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
            <input
              type="search"
              placeholder="Search transactions..."
              className="w-full rounded-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-mint/40 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3" ref={menuRef}>
          {/* Currency selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full glass px-3 py-2 text-xs font-semibold text-ink-100 hover:bg-slate-100 transition-colors duration-200"
            >
              {currency}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-32 rounded-xl glass shadow-card p-1.5 z-40"
                >
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c)
                        setCurrencyOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                        c === currency ? 'text-mint bg-slate-50' : 'text-ink-300 hover:text-ink-100 hover:bg-slate-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification bell */}
          <Link
            to="/dashboard/ai-assistant"
            className="relative w-9 h-9 rounded-full glass flex items-center justify-center text-ink-300 hover:text-ink-100 transition-colors duration-200 flex-shrink-0"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadInsightsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-mint text-[9px] font-bold text-[#FFFFFF] flex items-center justify-center">
                {unreadInsightsCount > 9 ? '9+' : unreadInsightsCount}
              </span>
            )}
          </Link>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full glass pl-1 pr-2 sm:pr-3 py-1 hover:bg-slate-100 transition-colors duration-200"
            >
              <span className="w-7 h-7 rounded-full bg-mint-emerald flex items-center justify-center text-[11px] font-bold text-[#FFFFFF] flex-shrink-0">
                {initials || <User className="w-3.5 h-3.5" />}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-300 hidden sm:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl glass shadow-card p-1.5 z-40"
                >
                  <div className="px-3 py-2 border-b border-slate-200 mb-1">
                    <p className="text-sm font-medium text-ink-100 truncate">{displayName}</p>
                    <p className="text-xs text-ink-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-300 hover:text-ink-100 hover:bg-slate-50 transition-colors duration-150"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-300 hover:text-rose-500 hover:bg-rose-500/[0.06] transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
