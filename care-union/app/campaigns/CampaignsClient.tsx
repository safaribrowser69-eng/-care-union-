'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { CATEGORY_META } from '@/types'
import type { Campaign, CampaignCategory } from '@/types'

export function CampaignsClient({ campaigns }: { campaigns: Campaign[] }) {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get('category') as CampaignCategory) || 'all'
  const [category, setCategory] = useState<CampaignCategory | 'all'>(initialCategory)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return campaigns.filter(c => {
      const matchCategory = category === 'all' || c.category === category
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.short_desc.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [campaigns, category, search])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-navy py-16 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">All Campaigns</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Choose a Cause to Support</h1>
          <p className="text-white/60 text-base mb-8">Every campaign is 100% transparent. Track exactly how your donation creates impact.</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-green-400 text-sm" />
            {search && (<button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"><X className="w-4 h-4" /></button>)}
          </div>
        </div>
      </div>

      <div className="sticky top-[68px] z-30 bg-white border-b border-slate-100 px-5 md:px-10 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-2 w-max md:w-full">
          <button onClick={() => setCategory('all')} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${category === 'all' ? 'bg-navy-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All Campaigns</button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => setCategory(key as CampaignCategory)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${category === key ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} style={category === key ? { background: meta.color } : undefined}>
              <span>{meta.icon}</span>{meta.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-navy-800 mb-2">No campaigns found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or filter.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (<CampaignCard key={c.id} campaign={c} index={i} />))}
          </div>
        )}
      </div>
    </div>
  )
}
