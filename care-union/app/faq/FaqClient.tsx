'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import type { Faq } from '@/types'

const CATEGORIES = ['all', 'general', 'donations', 'payments', 'transparency', 'volunteering', 'corporate', 'privacy', 'impact']

export function FaqClient({ faqs }: { faqs: Faq[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => faqs.filter(f => {
    const matchCat = category === 'all' || f.category === category
    const q = search.toLowerCase()
    const matchSearch = !search || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [faqs, category, search])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-navy py-16 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">Help Center</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-white/60 text-base mb-8">Find answers to common questions about donations, payments, and transparency.</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..." className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-green-400 text-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-12">
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${category === c ? 'bg-navy-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-navy-300'}`}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🤔</div>
            <h3 className="font-display text-xl font-bold text-navy-800 mb-2">No FAQs found</h3>
            <p className="text-slate-400 text-sm mb-6">Can't find what you're looking for? Ask us directly.</p>
            <Link href="/contact" className="btn-primary py-2.5 px-6 inline-flex text-sm"><MessageCircle className="w-4 h-4" /> Contact Us</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(faq => (
              <div key={faq.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-navy-800 text-sm">{faq.question}</span>
                  <motion.div animate={{ rotate: openId === faq.id ? 180 : 0 }} className="flex-shrink-0"><ChevronDown className="w-4 h-4 text-slate-400" /></motion.div>
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-navy-900 rounded-2xl p-8 text-center">
          <h3 className="font-display text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-white/50 text-sm mb-5">Our team is here to help. Reach out anytime.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/contact" className="btn-primary py-2.5 px-6 text-sm">Contact Us</Link>
            <a href="https://wa.me/918789477448" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#20bd5c] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">WhatsApp Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
