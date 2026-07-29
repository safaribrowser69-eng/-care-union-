'use client'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { useAuth } from '@/hooks/useAuth'

export function Providers({ children }: { children: React.ReactNode }) {
  useAuth()
  return (<>{children}<WhatsAppFloat /></>)
}
