'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import type { SiteStat } from '@/types'

const DEFAULTS = [
  { key: 'meals_served', value: '12400', label: 'Meals Served', icon: '🍱' },
  { key: 'families_helped', value: '2800', label: 'Families Helped', icon: '👨‍👩‍👧‍👦' },
  { key: 'animals_fed', value: '3200', label: 'Animals Fed', icon: '🐾' },
  { key: 'trees_planted', value: '289', label: 'Trees Planted', icon: '🌱' },
]

export function StatsCounter() {
  const [stats, setStats] = useState(DEFAULTS)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => {
      if (d.success && d.stats?.length) {
        const map = new Map((d.stats as SiteStat[]).map(s => [s.key, s.value]))
        setStats(prev => prev.map(s => ({ ...s, value: map.get(s.key) || s.value })))
      }
    }).catch(() => {})
  }, [])

  return (
    <section className="bg-white py-16 px-5 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
            <div className="text-4xl mb-3">{s.icon}</div>
            <div className="font-display text-3xl md:text-4xl font-bold text-navy-800">
              <AnimatedCounter value={parseInt(s.value) || 0} suffix="+" />
            </div>
            <div className="text-slate-400 text-sm mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
