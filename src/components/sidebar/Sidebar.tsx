import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Repeat,
  PiggyBank,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  Waves,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Transactions', to: '/dashboard/transactions', icon: ArrowLeftRight },
  { label: 'Income', to: '/dashboard/income', icon: TrendingUp },
  { label: 'Expenses', to: '/dashboard/expenses', icon: TrendingDown },
  { label: 'Subscriptions', to: '/dashboard/subscriptions', icon: Repeat },
  { label: 'Savings Goals', to: '/dashboard/savings-goals', icon: PiggyBank },
  { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
  { label: 'AI Assistant', to: '/dashboard/ai-assistant', icon: Sparkles },
]

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    showToast('You have been signed out.', 'info')
    navigate('/login', { replace: true })
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 px-5 py-6 ${collapsed ? 'justify-center px-0' : ''}`}>
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-mint-emerald flex-shrink-0">
          <Waves className="w-[18px] h-[18px] text-[#04140D]" strokeWidth={2.5} />
        </span>
        {!collapsed && (
          <span className="font-display font-bold text-lg text-ink-100 whitespace-nowrap">
            MoneyPilot
          </span>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-ink-100 bg-white/[0.06] border border-mint/20'
                  : 'text-ink-300 hover:text-ink-100 hover:bg-white/[0.03] border border-transparent'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-mint shadow-glow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <item.icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-mint' : ''}`}
                />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 flex flex-col gap-1 border-t border-white/[0.06] pt-3 mt-2">
        <NavLink
          to="/dashboard/settings"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive ? 'text-ink-100 bg-white/[0.06]' : 'text-ink-300 hover:text-ink-100 hover:bg-white/[0.03]'
            } ${collapsed ? 'justify-center px-0' : ''}`
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 hover:text-ink-100 hover:bg-white/[0.03] transition-all duration-200 mt-1"
        >
          {collapsed ? (
            <ChevronsRight className="w-[18px] h-[18px] flex-shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="w-[18px] h-[18px] flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block flex-shrink-0 h-screen sticky top-0 glass border-r border-white/[0.06] overflow-hidden"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed inset-y-0 left-0 w-[260px] glass border-r border-white/[0.06] z-50"
            >
              <button
                onClick={onCloseMobile}
                className="absolute top-5 right-3 text-ink-500 hover:text-ink-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
