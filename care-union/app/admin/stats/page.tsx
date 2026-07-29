'use client'
import { useEffect, useState } from 'react'
import { Loader2, Save, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import type { SiteStat } from '@/types'

const STAT_KEYS = [
  { key:'meals_served', label:'Meals Served', placeholder:'12400' },
  { key:'families_helped', label:'Families Helped', placeholder:'2800' },
  { key:'animals_fed', label:'Animals Fed', placeholder:'3200' },
  { key:'trees_planted', label:'Trees Planted', placeholder:'289' },
  { key:'total_donors', label:'Total Donors', placeholder:'1847' },
  { key:'cities_reached', label:'Cities Reached', placeholder:'12' },
  { key:'drives_conducted', label:'Drives Conducted', placeholder:'48' },
  { key:'transparency', label:'Transparency (%)', placeholder:'100' },
]

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_stats').select('*').then(({ data }) => {
      if (data) { const map: Record<string, string> = {}; (data as SiteStat[]).forEach(s => { map[s.key] = s.value }); setStats(map) }
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const statsArray = STAT_KEYS.filter(k => stats[k.key] !== undefined).map(k => ({ key: k.key, value: stats[k.key], label: k.label }))
      const res = await fetch('/api/admin/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stats: statsArray }) })
      const data = await res.json()
      if (data.success) toast.success('Stats updated!')
      else toast.error(data.message || 'Save failed.')
    } catch { toast.error('Save failed.') } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold text-navy-900">Homepage Stats</h1><p className="text-slate-400 text-sm mt-1">Numbers shown on the homepage stats section.</p></div><button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-5 text-sm">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>) : (<><Save className="w-4 h-4" /> Save All</>)}</button></div>

      {loading ? (<div className="bg-white rounded-2xl p-12 text-center shadow-card"><Loader2 className="w-7 h-7 animate-spin text-navy-300 mx-auto" /></div>) : (
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-100"><div className="grid grid-cols-3 text-xs font-semibold text-slate-400 uppercase tracking-wide"><span>Stat</span><span>Current Value</span><span>Preview</span></div></div>
          <div className="divide-y divide-slate-50">
            {STAT_KEYS.map(k => (
              <div key={k.key} className="grid grid-cols-3 items-center gap-4 px-6 py-4">
                <div><div className="font-medium text-navy-800 text-sm">{k.label}</div><div className="text-slate-400 text-xs font-mono mt-0.5">{k.key}</div></div>
                <input type="text" value={stats[k.key] || ''} onChange={e => setStats(prev => ({ ...prev, [k.key]: e.target.value }))} className="input text-sm py-2" placeholder={k.placeholder} />
                <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-navy-300" /><span className="font-display font-bold text-navy-700 text-lg">{stats[k.key] || k.placeholder}</span>{k.key === 'transparency' && <span className="text-slate-400 text-sm">%</span>}</div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100"><button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6 text-sm">{saving ? 'Saving...' : 'Save All Stats'}</button></div>
        </div>
      )}

      <div className="bg-navy-50 border border-navy-100 rounded-2xl p-5 text-sm text-navy-700 leading-relaxed">💡 <strong>Tip:</strong> These stats appear on the homepage and transparency page. Update them after each monthly report.</div>
    </div>
  )
}
