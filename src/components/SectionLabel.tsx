interface SectionLabelProps {
  children: string
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-wide text-mint uppercase mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-glow" />
      {children}
    </div>
  )
}
