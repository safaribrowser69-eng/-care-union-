'use client'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { formatCurrency, timeAgo } from '@/lib/utils'
import type { DonorWall } from '@/types'

const SAMPLE: DonorWall[] = [
  { id:'t1', name:'Rahul Sharma', amount:500, cause:'Hunger Relief', city:'Delhi', is_anonymous:false, created_at:new Date().toISOString() },
  { id:'t2', name:'Priya Mehta', amount:1000, cause:'Birthday Blessings', city:'Mumbai', is_anonymous:false, created_at:new Date().toISOString() },
  { id:'t3', name:'Anonymous', amount:250, cause:'Animal Welfare', city:'Bangalore', is_anonymous:true, created_at:new Date().toISOString() },
  { id:'t4', name:'Vikram Singh', amount:5000, cause:'Birthday Party', city:'Pune', is_anonymous:false, created_at:new Date().toISOString() },
  { id:'t5', name:'Ananya Roy', amount:100, cause:'Plant a Tree', city:'Chennai', is_anonymous:false, created_at:new Date().toISOString() },
  { id:'t6', name:'Karan Mehta', amount:250, cause:'Women Health', city:'Jaipur', is_anonymous:false, created_at:new Date().toISOString() },
]

export function DonorTicker() {
  const [donors, setDonors] = useState<DonorWall[]>(SAMPLE)

  useEffect(() => {
    fetch('/api/donor-wall?limit=15').then(r => r.json()).then(d => { if (d.success && d.data?.length) setDonors(d.data) }).catch(() => {})
  }, [])

  const doubled = [...donors, ...donors]

  return (
    <div className="bg-navy-900 py-3 overflow-hidden ticker-wrap border-y border-white/5">
      <div className="flex gap-8 animate-ticker w-max">
        {doubled.map((d, i) => (
          <div key={`${d.id}-${i}`} className="flex items-center gap-2 text-white/70 text-sm whitespace-nowrap flex-shrink-0">
            <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400 flex-shrink-0" />
            <span className="font-semibold text-white">{d.is_anonymous ? 'Anonymous' : d.name}</span>
            <span>donated</span>
            <span className="font-bold text-green-400">{formatCurrency(d.amount)}</span>
            {d.cause && <span className="text-white/40">for {d.cause}</span>}
            <span className="text-white/30">· {timeAgo(d.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
