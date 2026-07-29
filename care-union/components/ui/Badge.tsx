import { cn } from '@/lib/utils'

export function Badge({ children, className, color }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', className)} style={color ? { background: `${color}15`, color } : undefined}>
      {children}
    </span>
  )
}

export function ProgressBar({ percent, color = '#1B3A6B' }: { percent: number; color?: string }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(percent, 100)}%`, background: color }} />
    </div>
  )
}

export function SectionHeader({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={cn('mb-10', center && 'text-center')}>
      {eyebrow && <p className="text-xs font-bold tracking-widest uppercase text-forest-600 mb-2">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-3">{title}</h2>
      {subtitle && <p className={cn('text-slate-500 text-base leading-relaxed', center && 'max-w-2xl mx-auto')}>{subtitle}</p>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-slate-200 rounded-lg animate-pulse', className)} />
}
