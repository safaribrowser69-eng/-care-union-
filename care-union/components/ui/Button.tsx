import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }: ButtonProps) {
  const sizes = { sm: 'py-2 px-4 text-xs', md: 'py-3 px-6 text-sm', lg: 'py-3.5 px-8 text-base' }
  const variants = {
    primary: 'bg-navy-700 hover:bg-navy-800 text-white shadow-navy hover:-translate-y-0.5',
    outline: 'border-2 border-navy-200 text-navy-700 hover:bg-navy-50',
    ghost: 'text-navy-700 hover:bg-navy-50',
  }
  return (
    <button
      disabled={disabled || loading}
      className={cn('inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed', sizes[size], variants[variant], className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
