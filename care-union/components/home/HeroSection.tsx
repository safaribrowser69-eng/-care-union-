'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, ShieldCheck } from 'lucide-react'
import type { HomepageBanner } from '@/types'

export function HeroSection({ banners }: { banners: HomepageBanner[] }) {
  const [index, setIndex] = useState(0)
  const slides = banners.length > 0 ? banners : [{ id: 'default', title: 'Together We Transform Lives', subtitle: 'Join thousands of donors helping underprivileged families across India.', image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=90', cta_text: 'Donate Now', cta_link: '/campaigns' }] as HomepageBanner[]

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  const slide = slides[index]

  return (
    <section className="relative h-[560px] md:h-[640px] overflow-hidden bg-navy-900">
      <AnimatePresence mode="wait">
        <motion.div key={slide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
          <Image src={slide.image_url} alt={slide.title} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-navy-900/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-5 md:px-10 flex flex-col justify-center">
        <motion.div key={`content-${slide.id}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> 100% Transparent NGO
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-5 text-balance">{slide.title}</h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">{slide.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={slide.cta_link} className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-green hover:-translate-y-0.5">
              <Heart className="w-4 h-4 fill-current" /> {slide.cta_text}
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-all">Learn More</Link>
          </div>
        </motion.div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
          <button onClick={() => setIndex(i => (i - 1 + slides.length) % slides.length)} className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full items-center justify-center transition-colors z-10" aria-label="Previous slide"><ChevronLeft className="w-5 h-5 text-white" /></button>
          <button onClick={() => setIndex(i => (i + 1) % slides.length)} className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full items-center justify-center transition-colors z-10" aria-label="Next slide"><ChevronRight className="w-5 h-5 text-white" /></button>
        </>
      )}
    </section>
  )
}
