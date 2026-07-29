import type { Metadata } from 'next'
import AdminLayoutClient from './AdminLayoutClient'

export const metadata: Metadata = { title: { default: 'Admin Panel', template: '%s — Admin | Care Union Foundation' }, robots: { index: false, follow: false, noarchive: true } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
