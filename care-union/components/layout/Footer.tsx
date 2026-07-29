'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Mail, Phone, Instagram, MapPin, Heart } from 'lucide-react'
import { CATEGORY_META } from '@/types'

const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Transparency', href: '/transparency' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]
const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

export function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className="bg-navy-900 text-white/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative w-10 h-10"><Image src="/logo.png" alt="Care Union" fill className="object-contain" /></div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">CARE <span className="text-green-400">UNION</span></div>
                <div className="text-[9px] text-white/40 tracking-wider uppercase">Foundation</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5">Together We Transform Lives. A 100% transparent NGO dedicated to hunger relief, education, animal welfare, and healthcare across India.</p>
            <div className="flex gap-3">
              <a href="https://instagram.com/care.union" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="https://wa.me/918789477448" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Phone className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Campaigns</h4>
            <ul className="space-y-2.5">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <li key={key}><Link href={`/campaigns?category=${key}`} className="text-sm hover:text-white transition-colors flex items-center gap-2"><span>{meta.icon}</span>{meta.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(l => (<li key={l.href}><Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link></li>))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" /><a href="mailto:careunion.info@gmail.com" className="hover:text-white transition-colors">careunion.info@gmail.com</a></li>
              <li className="flex items-start gap-2.5 text-sm"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" /><a href="https://wa.me/918789477448" className="hover:text-white transition-colors">+91 87894 77448</a></li>
              <li className="flex items-start gap-2.5 text-sm"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>Serving communities across India</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Care Union Foundation. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map(l => (<Link key={l.href} href={l.href} className="text-xs text-white/40 hover:text-white transition-colors">{l.label}</Link>))}
          </div>
          <p className="text-xs text-white/40 flex items-center gap-1">Made with <Heart className="w-3 h-3 fill-red-400 text-red-400" /> for humanity</p>
        </div>
      </div>
    </footer>
  )
}
