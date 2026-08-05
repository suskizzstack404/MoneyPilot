import type { ReactNode, CSSProperties } from 'react'
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react'
import Button from '../Button'

export function Skeleton({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.05] ${className}`} style={style} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl glass p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-12 h-4" />
      </div>
      <Skeleton className="w-24 h-3" />
      <Skeleton className="w-32 h-7" />
      <Skeleton className="w-full h-10" />
    </div>
  )
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="rounded-2xl glass p-6">
      <Skeleton className="w-40 h-4 mb-6" />
      <Skeleton className="w-full" style={{ height }} />
    </div>
  )
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-2xl glass p-6 flex flex-col gap-4">
      <Skeleton className="w-36 h-4 mb-1" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="w-1/2 h-3" />
              <Skeleton className="w-1/3 h-2.5" />
            </div>
          </div>
          <Skeleton className="w-14 h-3" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 text-ink-500">
        {icon ?? <Inbox className="w-5 h-5" />}
      </div>
      <p className="text-sm font-semibold text-ink-100">{title}</p>
      <p className="text-xs text-ink-500 mt-1.5 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-400/25 flex items-center justify-center mb-4 text-rose-400">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <p className="text-sm font-semibold text-ink-100">Something went wrong</p>
      <p className="text-xs text-ink-500 mt-1.5 max-w-xs leading-relaxed">{message}</p>
      <Button
        size="md"
        variant="secondary"
        className="mt-5"
        icon={<RefreshCw className="w-3.5 h-3.5" />}
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  )
}
