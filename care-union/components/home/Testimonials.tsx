'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { getInitials, avatarColor } from '@/lib/utils'
import type { Testimonial } from '@/types'

const SAMPLE: Testimonial[] = [
  { id:'s1', name:'Rahul Sharma', location:'Delhi', role:'Regular Donor', text:'I donated on my birthday instead of a party. Care Union sent me photos of 50 children smiling after receiving food. It was the best birthday gift I have ever given myself.', rating:5, is_active:true, sort_order:1, created_at:'' },
  { id:'s2', name:'Priya Mehta', location:'Mumbai', role:'Monthly Contributor', text:'The transparency they maintain is incredible. Every month I get a detailed report showing exactly where my money went.', rating:5, is_active:true, sort_order:2, created_at:'' },
  { id:'s3', name:'Vikram Singh', location:'Bangalore', role:'Corporate Donor', text:'We used Care Union for our CSR initiative. Highly professional and the impact reports were perfect for our annual report.', rating:5, is_active:true, sort_order:3, created_at:'' },
]

export function Testimonials() {
  const [items] = useState<Testimonial[]>(SAMPLE)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % items.length), 6000)
    return () => clearInterval(t)
  }, [items.length])

  const t = items[index]

  return (
    <section className="bg-gradient-navy py-20 px-5 md:px-10">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">Donor Stories</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-12">What Our Donors Say</h2>

        <div className="relative min-h-[260px] flex items-center justify-center">
          <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 text-white/10" />
          <AnimatePresence mode="wait">
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }} className="relative">
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (<Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />))}
              </div>
              <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-7 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: avatarColor(t.name) }}>{getInitials(t.name)}</div>
                <div className="text-left">
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-white/50 text-xs">{t.role}{t.location ? ` · ${t.location}` : ''}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10">
          <button onClick={() => setIndex(i => (i - 1 + items.length) % items.length)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Previous testimonial"><ChevronLeft className="w-4 h-4 text-white" /></button>
          <div className="flex gap-2">
            {items.map((_, i) => (<button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} aria-label={`Go to testimonial ${i + 1}`} />))}
          </div>
          <button onClick={() => setIndex(i => (i + 1) % items.length)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Next testimonial"><ChevronRight className="w-4 h-4 text-white" /></button>
        </div>
      </div>
    </section>
  )
}
