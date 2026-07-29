'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar } from 'lucide-react'
import type { Gallery } from '@/types'

const CATEGORIES = ['all', 'hunger', 'birthday', 'animals', 'nature', 'medicine', 'general']

export function GalleryClient({ items }: { items: Gallery[] }) {
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<Gallery | null>(null)

  const filtered = useMemo(() => category === 'all' ? items : items.filter(i => i.category === category), [items, category])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-navy py-16 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">Our Impact</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-white/60 text-base">Real moments from our drives — see the impact your donations create.</p>
        </div>
      </div>

      <div className="sticky top-[68px] z-30 bg-white border-b border-slate-100 px-5 md:px-10 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-2 w-max md:w-full">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all ${category === c ? 'bg-navy-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20"><div className="text-5xl mb-4">📸</div><p className="text-slate-400">No photos in this category yet.</p></div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((item, i) => (
              <motion.button key={item.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.06 }} onClick={() => setSelected(item)} className="break-inside-avoid mb-4 block w-full relative rounded-2xl overflow-hidden group">
                <Image src={item.image_url} alt={item.title} width={500} height={400} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-left"><p className="text-white font-semibold text-sm">{item.title}</p>{item.location && <p className="text-white/70 text-xs mt-0.5">{item.location}</p>}</div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Close"><X className="w-5 h-5 text-white" /></button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <Image src={selected.image_url} alt={selected.title} fill className="object-contain bg-black" />
              </div>
              <div className="text-white text-center">
                <h3 className="font-display font-bold text-xl mb-2">{selected.title}</h3>
                {selected.description && <p className="text-white/60 text-sm mb-3 max-w-lg mx-auto">{selected.description}</p>}
                <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
                  {selected.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selected.location}</span>}
                  {selected.drive_date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(selected.drive_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
