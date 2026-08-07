import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

interface CommonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  icon?: ReactNode
  isLoading?: boolean
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsRouterLink = CommonProps &
  Omit<LinkProps, keyof CommonProps | 'to'> & {
    to: string
    href?: undefined
  }

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'> & {
    href: string
    to?: undefined
  }

type ButtonProps = ButtonAsButton | ButtonAsRouterLink | ButtonAsAnchor

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 whitespace-nowrap disabled:opacity-60 disabled:pointer-events-none'

const variants: Record<string, string> = {
  primary:
    'bg-mint-emerald text-[#FFFFFF] shadow-glow-sm hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'glass text-ink-100 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-ink-300 hover:text-ink-100',
}

const sizes: Record<string, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

/**
 * Shared CTA button. Renders as:
 * - a react-router <Link> when `to` is provided (internal SPA navigation)
 * - a plain <a> when `href` is provided (hash anchors, mailto, external links)
 * - a <button> otherwise (form submits, in-page actions)
 * All three share identical visual styling.
 */
export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    isLoading = false,
    children,
    className = '',
  } = props

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      {!isLoading && icon}
    </>
  )

  if ('to' in props && props.to) {
    const { to, variant: _v, size: _s, icon: _i, isLoading: _l, children: _c, className: _cl, ...rest } = props
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, variant: _v, size: _s, icon: _i, isLoading: _l, children: _c, className: _cl, ...rest } = props
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  const { variant: _v, size: _s, icon: _i, isLoading: _l, children: _c, className: _cl, disabled, ...rest } =
    props as ButtonAsButton
  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {content}
    </button>
  )
}
