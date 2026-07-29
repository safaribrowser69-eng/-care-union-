'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Megaphone, ImageIcon, HelpCircle, Mail, BarChart3, Image as BannerIcon, Receipt, LogOut, Menu, X, ShieldCheck, ChevronRight, TrendingUp } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
  { label: 'Donations', href: '/admin/donations', icon: Receipt },
  { label: 'Banners', href: '/admin/banners', icon: BannerIcon },
  { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Transparency', href: '/admin/transparency', icon: BarChart3 },
  { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { label: 'Contact', href: '/admin/contact', icon: Mail },
  { label: 'Site Stats', href: '/admin/stats', icon: TrendingUp },
]

function NavLink({ item, active, onClick }: { item: typeof NAV_ITEMS[number]; active: boolean; onClick?: () => void }) {
  const Icon = item.icon
  return (
    <Link href={item.href} onClick={onClick} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200', active ? 'bg-white/15 text-white' : 'text-white/55 hover:bg-white/8 hover:text-white')}>
      <Icon className="w-4 h-4 flex-shrink-0" />{item.label}{active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
    </Link>
  )
}

function Sidebar({ pathname, onLogout, onNavClick }: { pathname: string; onLogout: () => void; onNavClick?: () => void }) {
  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
  return (
    <div className="flex flex-col h-full bg-navy-900">
      <div className="px-5 py-5 border-b border-white/8 flex items-center gap-3 flex-shrink-0">
        <div className="relative w-9 h-9 bg-white rounded-lg flex-shrink-0"><Image src="/logo.png" alt="Care Union" fill className="object-contain p-0.5" /></div>
        <div><div className="text-white font-bold text-sm font-display leading-none">CARE UNION</div><div className="text-white/40 text-[10px] mt-0.5 flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Admin Panel</div></div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
        {NAV_ITEMS.map(item => (<NavLink key={item.href} item={item} active={isActive(item.href)} onClick={onNavClick} />))}
      </nav>
      <div className="px-3 py-4 border-t border-white/8 flex-shrink-0 space-y-0.5">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all">↗ View Site</Link>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"><LogOut className="w-4 h-4" /> Logout</button>
      </div>
    </div>
  )
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, logout } = useUserStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { if (!isAdmin) router.replace('/login?role=admin') }, [isAdmin, router])
  useEffect(() => { setSidebarOpen(false) }, [pathname])
  if (!isAdmin) return null

  const handleLogout = () => { logout(); router.push('/') }
  const currentLabel = NAV_ITEMS.find(n => n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href))?.label || 'Admin'

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <aside className="hidden lg:block w-56 flex-shrink-0"><Sidebar pathname={pathname} onLogout={handleLogout} /></aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <aside className="relative w-56 flex-shrink-0 shadow-2xl"><Sidebar pathname={pathname} onLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} /></aside>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(v => !v)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Toggle navigation">{sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}</button>
          <div className="flex-1 min-w-0"><span className="text-sm font-semibold text-navy-800">{currentLabel}</span></div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0"><ShieldCheck className="w-3.5 h-3.5 text-navy-500" /><span className="hidden sm:block">Admin</span></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
