import type { ComponentType } from 'react'
import {
  Mic,
  Sparkles,
  LineChart,
  Repeat,
  Globe2,
  CloudCog,
  type LucideProps,
} from 'lucide-react'

export const navLinks = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { label: 'Pricing', href: '#pricing', id: 'pricing' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
]

export interface Feature {
  icon: ComponentType<LucideProps>
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: Mic,
    title: 'Voice Expense Tracking',
    description:
      'Say what you spent and on what. MoneyPilot parses the amount, merchant, and category from a single sentence, no typing required.',
  },
  {
    icon: Sparkles,
    title: 'AI Financial Insights',
    description:
      'Get plain-language callouts when your spending drifts from your usual pattern, with reasons and suggested next steps.',
  },
  {
    icon: LineChart,
    title: 'Smart Analytics',
    description:
      'Every transaction rolls into live charts for spending, income, and savings rate, updated the moment you speak.',
  },
  {
    icon: Repeat,
    title: 'Subscription Tracking',
    description:
      'MoneyPilot recognizes recurring charges automatically and flags upcoming renewals before they surprise you.',
  },
  {
    icon: Globe2,
    title: 'Multi Currency',
    description:
      'Log an expense in any currency. Balances and reports convert automatically using live exchange rates.',
  },
  {
    icon: CloudCog,
    title: 'Cloud Sync',
    description:
      'Your ledger stays in sync across every device the moment you speak, encrypted end to end.',
  },
]

export const trustedBy = [
  'Northbeam',
  'Fintra',
  'Vaultly',
  'Ledgerly',
  'Coral Bank',
  'Paylane',
]

export const transactions = [
  { merchant: 'Burger King', category: 'Food & Dining', amount: -850, time: '2m ago' },
  { merchant: 'Salary — Acme Corp', category: 'Income', amount: 92000, time: '1d ago' },
  { merchant: 'Netflix', category: 'Subscription', amount: -649, time: '2d ago' },
  { merchant: 'Uber', category: 'Transport', amount: -320, time: '3d ago' },
]

export const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    description: 'For getting started with voice-first budgeting.',
    cta: 'Start Free',
    highlighted: false,
    features: [
      'Unlimited voice expense logging',
      'Basic monthly analytics',
      '1 connected account',
      'Standard AI insights',
    ],
  },
  {
    name: 'Pro',
    price: '₹399',
    period: '/month',
    description: 'For people who want the full financial picture.',
    cta: 'Upgrade to Pro',
    highlighted: true,
    features: [
      'Everything in Free',
      'Advanced AI spending predictions',
      'Unlimited connected accounts',
      'Multi-currency support',
      'Subscription renewal alerts',
      'Priority support',
    ],
  },
]

export const faqs = [
  {
    q: 'How does MoneyPilot understand what I say?',
    a: 'MoneyPilot uses on-device and cloud speech models tuned for financial language. It listens for an amount, a merchant, and context clues, then classifies the category automatically.',
  },
  {
    q: 'What if I speak a different language?',
    a: 'MoneyPilot supports multiple languages and code-switching, so you can mix languages the way you naturally speak.',
  },
  {
    q: 'Is my financial data secure?',
    a: 'All data is encrypted in transit and at rest. Voice recordings are processed and discarded, only the structured transaction is stored.',
  },
  {
    q: 'Can I edit a transaction MoneyPilot logged incorrectly?',
    a: 'Yes. Tap any transaction to correct the amount, merchant, or category, and MoneyPilot learns from the correction.',
  },
  {
    q: 'Does MoneyPilot work with my bank?',
    a: 'MoneyPilot connects to most major banks for balance sync, and works entirely standalone if you prefer to log manually by voice.',
  },
]

export const howItWorks = [
  {
    title: 'Speak',
    description: 'Say an expense the way you would tell a friend. No forms, no dropdowns.',
  },
  {
    title: 'Analyze',
    description: 'MoneyPilot extracts amount, merchant, and category, then updates your ledger instantly.',
  },
  {
    title: 'Improve',
    description: 'AI insights surface patterns and nudge you toward better habits, week over week.',
  },
]
