import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase-server'
import { formatCurrency } from '@/lib/utils'
import { ShieldCheck, TrendingUp, Users, FileText } from 'lucide-react'
import { LiveDonorFeed } from '@/components/ui/LiveDonorFeed'
import type { TransparencyReport } from '@/types'

export const metadata: Metadata = {
  title: 'Transparency & Impact Reports',
  description: 'See exactly how Care Union Foundation spends every rupee donated. Monthly transparency reports with fund allocation breakdowns.',
}

export const revalidate = 300

async function getReports(): Promise<TransparencyReport[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('transparency_reports').select('*, fund_allocations(*)').eq('is_published', true).order('year', { ascending: false }).order('month', { ascending: false })
    return (data || []) as TransparencyReport[]
  } catch { return [] }
}

export default async function TransparencyPage() {
  const reports = await getReports()
  const latest = reports[0]

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-navy py-20 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-3">Full Accountability</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">Transparency & Impact</h1>
          <p className="text-white/70 text-base leading-relaxed">We believe every donor deserves to know exactly where their money goes. Here's our complete financial transparency.</p>
        </div>
      </div>

      <div className="py-14 px-5 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'Zero Overhead', desc: '100% of your donation reaches the intended cause. Operational costs are covered separately.' },
            { icon: FileText, title: 'Monthly Reports', desc: 'We publish detailed reports every month with photos, videos, and complete fund breakdowns.' },
            { icon: Users, title: 'Open to Audit', desc: 'Any donor can request a detailed breakdown of how their specific donation was utilised.' },
          ].map(f => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <Icon className="w-8 h-8 text-forest-600 mb-4" />
                <h3 className="font-display font-bold text-navy-800 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {latest && (
        <div className="py-14 px-5 md:px-10 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy-900 mb-6">{latest.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Raised', value: formatCurrency(latest.total_raised) },
                { label: 'Total Spent', value: formatCurrency(latest.total_spent) },
                { label: 'Beneficiaries', value: latest.beneficiaries.toLocaleString('en-IN') },
                { label: 'Drives Conducted', value: latest.drives_conducted.toString() },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 text-center">
                  <div className="font-display font-bold text-navy-800 text-xl md:text-2xl">{s.value}</div>
                  <div className="text-slate-400 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-100">
              {latest.summary && <p className="text-slate-600 text-sm leading-relaxed mb-8">{latest.summary}</p>}
              {latest.fund_allocations && latest.fund_allocations.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-navy-800 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Fund Allocation</h3>
                    {latest.fund_allocations.map(fa => (
                      <div key={fa.id}>
                        <div className="flex justify-between text-sm mb-1"><span className="font-medium text-navy-700">{fa.category}</span><span className="text-slate-400">{formatCurrency(fa.amount)} · {fa.percentage}%</span></div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${fa.percentage}%`, background: fa.color }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90">
                      {(() => {
                        let offset = 0
                        return latest.fund_allocations.map(fa => {
                          const r = 35, circ = 2 * Math.PI * r
                          const dash = (fa.percentage / 100) * circ
                          const el = (<circle key={fa.id} cx="50" cy="50" r={r} fill="none" stroke={fa.color} strokeWidth="18" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} />)
                          offset += dash
                          return el
                        })
                      })()}
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="py-14 px-5 md:px-10 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-navy-900 mb-6 text-center">Live Donor Wall</h2>
          <LiveDonorFeed limit={8} />
        </div>
      </div>

      {reports.length > 1 && (
        <div className="py-14 px-5 md:px-10 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-6">Past Reports</h2>
            <div className="space-y-3">
              {reports.slice(1).map(r => (
                <div key={r.id} className="bg-white rounded-xl p-5 shadow-card border border-slate-100 flex items-center justify-between">
                  <div><div className="font-semibold text-navy-800">{r.title}</div><div className="text-slate-400 text-xs mt-1">{r.beneficiaries} beneficiaries · {r.drives_conducted} drives</div></div>
                  <div className="text-right"><div className="font-bold text-navy-700">{formatCurrency(r.total_raised)}</div><div className="text-slate-400 text-xs">raised</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
