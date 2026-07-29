'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUserStore } from '@/store/userStore'
import { CATEGORY_META } from '@/types'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Transparency', href: '/transparency' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [campaignsOpen, setCampaignsOpen] = useState(false)
  const count = useCartStore(s => s.count())
  const { user, isAdmin } = useUserStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  if (pathname?.startsWith('/admin')) return null

  return (
    <header className={cn('sticky top-0 z-40 transition-all duration-300', scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white')}>
      <nav className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="Care Union" fill className="object-contain" priority />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-navy-800 text-lg leading-none">CARE <span className="text-forest-500">UNION</span></div>
              <div className="text-[9px] text-slate-400 tracking-wider uppercase">Foundation</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <div className="relative" onMouseEnter={() => setCampaignsOpen(true)} onMouseLeave={() => setCampaignsOpen(false)}>
              <Link href="/campaigns" className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-navy-700 hover:bg-slate-50 transition-colors">
                Campaigns <ChevronDown className="w-3.5 h-3.5" />
              </Link>
              <AnimatePresence>
                {campaignsOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full left-0 bg-white rounded-2xl shadow-card-hover border border-slate-100 p-2 w-56">
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <Link key={key} href={`/campaigns?category=${key}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="text-xl">{meta.icon}</span>
                        <span className="text-sm font-medium text-navy-700">{meta.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {NAV_LINKS.slice(1).map(link => (
              <Link key={link.href} href={link.href} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', pathname === link.href ? 'text-navy-900 bg-slate-100' : 'text-navy-700 hover:bg-slate-50')}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <ShoppingCart className="w-5 h-5 text-navy-700" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{count}</span>
              )}
            </Link>
            <Link href={user || isAdmin ? (isAdmin ? '/admin' : '/dashboard') : '/login'} className="hidden sm:flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <User className="w-5 h-5 text-navy-700" />
            </Link>
            <Link href="/campaigns" className="hidden md:inline-flex btn-primary py-2.5 px-5 text-sm">Donate Now</Link>
            <button onClick={() => setMobileOpen(v => !v)} className="lg:hidden p-2.5 rounded-lg hover:bg-slate-50 transition-colors" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-slate-100">
            <div className="px-5 py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="block px-3 py-3 rounded-lg text-sm font-medium text-navy-700 hover:bg-slate-50">{link.label}</Link>
              ))}
              <Link href={user || isAdmin ? (isAdmin ? '/admin' : '/dashboard') : '/login'} className="block px-3 py-3 rounded-lg text-sm font-medium text-navy-700 hover:bg-slate-50">
                {user || isAdmin ? 'My Account' : 'Login'}
              </Link>
              <Link href="/campaigns" className="btn-primary w-full py-3 mt-2">Donate Now</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
