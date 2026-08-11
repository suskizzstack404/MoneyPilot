import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface SlideDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

export default function SlideDrawer({ open, onClose, title, description, children }: SlideDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-200 flex-shrink-0">
              <div>
                <h2 id="drawer-title" className="text-lg font-bold text-ink-100 font-display">
                  {title}
                </h2>
                {description && <p className="text-xs text-ink-500 mt-1">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-ink-500 hover:text-ink-100 transition-colors duration-200 -mr-1 -mt-1 p-1.5 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
