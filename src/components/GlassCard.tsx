import type { ReactNode, HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export default function GlassCard({
  children,
  hover = false,
  className = '',
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl shadow-card ${
        hover ? 'transition-all duration-300 hover:border-mint/30 hover:-translate-y-1 hover:shadow-glow-sm' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
