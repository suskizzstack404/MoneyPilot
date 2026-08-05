import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Waves } from 'lucide-react'
import { navLinks } from '../constants/data'
import Button from './Button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [active, setActive] = useState<string>('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: highlight whichever section is currently in view.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => !!el)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ${
          scrolled ? 'mt-3 px-4' : 'mt-5 px-4'
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full glass px-5 py-3 transition-shadow duration-300 ${
            scrolled ? 'shadow-card' : ''
          }`}
        >
          <a href="#home" className="flex items-center gap-2 font-display font-bold text-lg text-ink-100">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-mint-emerald">
              <Waves className="w-[18px] h-[18px] text-[#04140D]" strokeWidth={2.5} />
            </span>
            MoneyPilot
          </a>

          <nav
            className="hidden lg:flex items-center gap-1"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onMouseEnter={() => setHovered(link.id)}
                className="relative px-4 py-2 text-sm font-medium"
              >
                {hovered === link.id && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07] border border-mint/25 shadow-glow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative z-10 inline-block transition-colors duration-200 ${
                    active === link.id ? 'text-ink-100' : 'text-ink-300 hover:text-ink-100'
                  }`}
                >
                  {link.label}
                </motion.span>
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute left-1/2 bottom-0.5 -translate-x-1/2 w-1 h-1 rounded-full bg-mint shadow-glow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-ink-300 hover:text-ink-100 transition-colors duration-200 px-2"
            >
              Sign In
            </Link>
            <Button size="md" to="/signup">
              Get Started
            </Button>
          </div>

          <button
            className="lg:hidden text-ink-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden glass rounded-2xl mt-2 p-5 flex flex-col gap-4"
            >
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium ${
                    active === link.id ? 'text-ink-100' : 'text-ink-300 hover:text-ink-100'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-ink-300 text-left"
                >
                  Sign In
                </Link>
                <Button size="md" to="/signup" className="w-full" onClick={() => setOpen(false)}>
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
