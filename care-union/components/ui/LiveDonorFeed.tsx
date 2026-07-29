'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { formatCurrency, getInitials, avatarColor, timeAgo } from '@/lib/utils'
import type { DonorWall } from '@/types'

const SAMPLE_DONORS: DonorWall[] = [
  { id:'a1', name:'Rahul Sharma', amount:500, cause:'Food for Families', city:'Delhi', is_anonymous:false, created_at:new Date(Date.now()-90000).toISOString() },
  { id:'a2', name:'Priya Mehta', amount:1000, cause:'Birthday Blessings', city:'Mumbai', is_anonymous:false, created_at:new Date(Date.now()-180000).toISOString() },
  { id:'a3', name:'Anonymous', amount:250, cause:'Animal Welfare', city:'Bangalore', is_anonymous:true, created_at:new Date(Date.now()-270000).toISOString() },
  { id:'a4', name:'Vikram Singh', amount:5000, cause:'Birthday Party', city:'Pune', is_anonymous:false, created_at:new Date(Date.now()-360000).toISOString() },
  { id:'a5', name:'Ananya Roy', amount:100, cause:'Plant a Tree', city:'Chennai', is_anonymous:false, created_at:new Date(Date.now()-450000).toISOString() },
]

export function LiveDonorFeed({ limit = 5, pollInterval = 20000, className }: { limit?: number; pollInterval?: number; className?: string }) {
  const [donors, setDonors] = useState<DonorWall[]>(SAMPLE_DONORS.slice(0, limit))
  const [newDonor, setNewDonor] = useState<DonorWall | null>(null)

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch(`/api/donor-wall?limit=${limit}`)
      const json = await res.json()
      if (json.success && json.data?.length > 0) {
        const incoming = json.data as DonorWall[]
        setDonors(prev => {
          const existingIds = new Set(prev.map(d => d.id))
          const newest = incoming[0]
          if (!existingIds.has(newest.id)) setNewDonor(newest)
          return incoming
        })
      }
    } catch { /* fallback to sample data */ }
  }, [limit])

  useEffect(() => { fetchLatest(); const id = setInterval(fetchLatest, pollInterval); return () => clearInterval(id) }, [fetchLatest, pollInterval])
  useEffect(() => { if (newDonor) { const t = setTimeout(() => setNewDonor(null), 4000); return () => clearTimeout(t) } }, [newDonor])

  return (
    <div className={className}>
      <AnimatePresence>
        {newDonor && (
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.95 }} className="mb-3 flex items-center gap-3 bg-forest-500 text-white rounded-xl px-4 py-3 shadow-green text-sm">
            <Heart className="w-4 h-4 fill-current flex-shrink-0 animate-pulse" />
            <span className="font-semibold">{newDonor.is_anonymous ? 'Anonymous' : newDonor.name}</span>
            <span className="opacity-80">just donated</span>
            <span className="font-bold">{formatCurrency(newDonor.amount)}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-2">
        {donors.map((donor, i) => (
          <motion.div key={donor.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: donor.is_anonymous ? '#94a3b8' : avatarColor(donor.name) }}>
              {donor.is_anonymous ? '🎭' : getInitials(donor.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-navy-800 text-sm">{donor.is_anonymous ? 'Anonymous' : donor.name}</span>
                <span className="text-slate-400 text-xs">donated</span>
                <span className="font-bold text-forest-600 text-sm">{formatCurrency(donor.amount)}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {donor.cause && <span className="text-slate-400 text-xs truncate">{donor.cause}</span>}
                {donor.city && <span className="text-slate-300 text-xs">· {donor.city}</span>}
              </div>
            </div>
            <div className="text-xs text-slate-300 flex-shrink-0">{timeAgo(donor.created_at)}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
