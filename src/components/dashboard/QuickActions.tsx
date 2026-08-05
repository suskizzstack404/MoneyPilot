import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PlusCircle, MinusCircle, ArrowLeftRight, Target, Repeat } from 'lucide-react'

const actions = [
  { label: 'Add Income', to: '/dashboard/income', icon: PlusCircle, color: '#34D399' },
  { label: 'Add Expense', to: '/dashboard/expenses', icon: MinusCircle, color: '#F87171' },
  { label: 'Transfer', to: '/dashboard/transactions', icon: ArrowLeftRight, color: '#2DD4BF' },
  { label: 'New Goal', to: '/dashboard/savings-goals', icon: Target, color: '#10B981' },
  { label: 'Add Subscription', to: '/dashboard/subscriptions', icon: Repeat, color: '#6EE7B7' },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
          >
            <Link
              to={action.to}
              className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl glass p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-mint/25 hover:shadow-glow-sm"
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${action.color}1A`, color: action.color }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-xs font-medium text-ink-300 group-hover:text-ink-100 transition-colors duration-200">
                {action.label}
              </span>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
