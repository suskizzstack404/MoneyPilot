import { Waves, Twitter, Linkedin, Instagram, Github } from 'lucide-react'
import { navLinks } from '../constants/data'

const columns = [
  {
    title: 'Product',
    links: ['Features', 'How It Works', 'Pricing', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Press'],
  },
  {
    title: 'Resources',
    links: ['Help Center', 'API Docs', 'Community', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Security'],
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] mt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <a href="#home" className="flex items-center gap-2 font-display font-bold text-lg text-ink-100 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-mint-emerald">
                <Waves className="w-[18px] h-[18px] text-[#04140D]" strokeWidth={2.5} />
              </span>
              MoneyPilot
            </a>
            <p className="text-sm text-ink-500 leading-relaxed max-w-xs">
              Control your money by simply speaking. Voice-first budgeting, analytics, and AI insights in one calm place.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-ink-300 hover:text-mint hover:border-mint/30 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink-100 mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={navLinks.find((n) => n.label === link)?.href ?? '#'}
                      className="text-sm text-ink-500 hover:text-ink-100 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-ink-500">© 2026 MoneyPilot. All rights reserved.</p>
          <p className="text-xs text-ink-500">Made for people who'd rather talk than type.</p>
        </div>
      </div>
    </footer>
  )
}
