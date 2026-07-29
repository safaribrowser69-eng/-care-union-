'use client'
import { Mail, Phone, Instagram } from 'lucide-react'

export function TopBar() {
  return (
    <div className="hidden md:block bg-navy-900 text-white/70 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <a href="mailto:careunion.info@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3 h-3" /> careunion.info@gmail.com
          </a>
          <a href="https://wa.me/918789477448" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3 h-3" /> +91 87894 77448
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com/care.union" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Instagram className="w-3 h-3" /> @care.union
          </a>
          <span className="text-green-400 font-semibold">100% Transparent NGO</span>
        </div>
      </div>
    </div>
  )
}
