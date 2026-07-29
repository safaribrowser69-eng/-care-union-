'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2, Check, ToggleRight, ToggleLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import type { TransparencyReport, FundAllocation } from '@/types'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => ({ value: i + 1, label: m }))
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i)
const EMPTY_REPORT = { title:'', month:new Date().getMonth()+1, year:CURRENT_YEAR, total_raised:0, total_spent:0, beneficiaries:0, drives_conducted:0, summary:'', report_url:'', is_published:false }
const EMPTY_ALLOC = { category:'', amount:0, percentage:0, color:'#1B3A6B' }

export default function AdminTransparencyPage() {
  const [reports, setReports] = useState<TransparencyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<TransparencyReport | null>(null)
  const [form, setForm] = useState({ ...EMPTY_REPORT })
  const [allocations, setAllocations] = useState<Omit<FundAllocation, 'id'|'report_id'>[]>([{ ...EMPTY_ALLOC }])
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchReports = async () => { const { data } = await supabase.from('transparency_reports').select('*, fund_allocations(*)').order('year', { ascending: false }).order('month', { ascending: false }); setReports((data as TransparencyReport[]) || []); setLoading(false) }
  useEffect(() => { fetchReports() }, [])

  const openAdd = () => { setForm({ ...EMPTY_REPORT }); setAllocations([{ ...EMPTY_ALLOC }]); setEditing(null); setModal(true) }
  const openEdit = (r: TransparencyReport) => {
    setForm({ title:r.title, month:r.month||1, year:r.year, total_raised:r.total_raised, total_spent:r.total_spent, beneficiaries:r.beneficiaries, drives_conducted:r.drives_conducted, summary:r.summary||'', report_url:r.report_url||'', is_published:r.is_published })
    setAllocations(r.fund_allocations?.map(a => ({ category:a.category, amount:a.amount, percentage:a.percentage, color:a.color })) || [{ ...EMPTY_ALLOC }])
    setEditing(r); setModal(true)
  }
  const close = () => { setModal(false); setEditing(null) }
  const addAlloc = () => setAllocations(prev => [...prev, { ...EMPTY_ALLOC }])
  const removeAlloc = (i: number) => setAllocations(prev => prev.filter((_, idx) => idx !== i))
  const updateAlloc = (i: number, field: string, value: string | number) => setAllocations(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required.'); return }
    setSaving(true)
    try {
      let reportId = editing?.id
      if (editing) { const { error } = await supabase.from('transparency_reports').update(form).eq('id', editing.id); if (error) throw error; await supabase.from('fund_allocations').delete().eq('report_id', editing.id) }
      else { const { data, error } = await supabase.from('transparency_reports').insert(form).select().single(); if (error) throw error; reportId = data.id }
      if (allocations.some(a => a.category)) await supabase.from('fund_allocations').insert(allocations.filter(a => a.category).map(a => ({ ...a, report_id: reportId })))
      toast.success(editing ? 'Updated!' : 'Created!')
      await fetchReports(); close()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Save failed.') } finally { setSaving(false) }
  }
  const handleDelete = async (id: string) => { if (!confirm('Delete this report?')) return; await supabase.from('transparency_reports').delete().eq('id', id); toast.success('Deleted.'); fetchReports() }
  const handleToggle = async (id: string, val: boolean) => { await supabase.from('transparency_reports').update({ is_published: val }).eq('id', id); setReports(prev => prev.map(r => r.id === id ? { ...r, is_published: val } : r)); toast.success(val ? 'Published!' : 'Unpublished.') }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold text-navy-900">Transparency Reports</h1><p className="text-slate-400 text-sm mt-1">{reports.length} reports</p></div><button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> New Report</button></div>

      <div className="grid gap-4">
        {loading ? (<div className="bg-white rounded-2xl p-12 text-center shadow-card"><Loader2 className="w-7 h-7 animate-spin text-navy-300 mx-auto" /></div>) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card text-slate-400">No reports yet.</div>
        ) : reports.map(report => (
          <div key={report.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap"><h3 className="font-display font-bold text-navy-800">{report.title}</h3><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${report.is_published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{report.is_published ? '✅ Published' : '⏳ Draft'}</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {[{ label:'Raised', value:formatCurrency(report.total_raised) },{ label:'Spent', value:formatCurrency(report.total_spent) },{ label:'Beneficiaries', value:report.beneficiaries.toLocaleString('en-IN') },{ label:'Drives', value:report.drives_conducted.toString() }].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-lg p-2.5 text-center"><div className="font-bold text-navy-700 text-sm">{s.value}</div><div className="text-slate-400 text-[10px] mt-0.5">{s.label}</div></div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2"><button onClick={() => handleToggle(report.id, !report.is_published)}>{report.is_published ? <ToggleRight className="w-6 h-6 text-forest-500" /> : <ToggleLeft className="w-6 h-6 text-slate-300" />}</button><button onClick={() => openEdit(report)} className="p-2 rounded-lg bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(report.id)} className="p-2 rounded-lg bg-slate-100 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10"><h2 className="font-display font-bold text-navy-900">{editing ? 'Edit Report' : 'New Report'}</h2><button onClick={close} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button></div>
              <div className="p-5 space-y-4">
                <div><label className="input-label">Report Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" /></div>
                <div className="grid grid-cols-2 gap-3"><div><label className="input-label">Month</label><select value={form.month} onChange={e => setForm(f => ({ ...f, month: parseInt(e.target.value) }))} className="input">{MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div><div><label className="input-label">Year</label><select value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) }))} className="input">{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="input-label">Total Raised (₹)</label><input type="number" value={form.total_raised} onChange={e => setForm(f => ({ ...f, total_raised: parseFloat(e.target.value) }))} className="input" /></div>
                  <div><label className="input-label">Total Spent (₹)</label><input type="number" value={form.total_spent} onChange={e => setForm(f => ({ ...f, total_spent: parseFloat(e.target.value) }))} className="input" /></div>
                  <div><label className="input-label">Beneficiaries</label><input type="number" value={form.beneficiaries} onChange={e => setForm(f => ({ ...f, beneficiaries: parseInt(e.target.value) }))} className="input" /></div>
                  <div><label className="input-label">Drives</label><input type="number" value={form.drives_conducted} onChange={e => setForm(f => ({ ...f, drives_conducted: parseInt(e.target.value) }))} className="input" /></div>
                </div>
                <div><label className="input-label">Summary</label><textarea rows={3} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} className="input resize-none" /></div>
                <div>
                  <div className="flex items-center justify-between mb-2"><label className="input-label mb-0">Fund Allocations</label><button onClick={addAlloc} className="text-xs text-navy-700 font-semibold flex items-center gap-1"><Plus className="w-3 h-3" />Add Row</button></div>
                  <div className="space-y-2">
                    {allocations.map((a, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 items-center">
                        <input value={a.category} onChange={e => updateAlloc(i, 'category', e.target.value)} className="input col-span-2 text-xs py-2" placeholder="Category" />
                        <input type="number" value={a.amount} onChange={e => updateAlloc(i, 'amount', parseFloat(e.target.value))} className="input text-xs py-2" placeholder="₹" />
                        <input type="number" value={a.percentage} onChange={e => updateAlloc(i, 'percentage', parseFloat(e.target.value))} className="input text-xs py-2" placeholder="%" />
                        <div className="flex items-center gap-1"><input type="color" value={a.color} onChange={e => updateAlloc(i, 'color', e.target.value)} className="w-9 h-9 rounded-lg border border-slate-200" />{allocations.length > 1 && <button onClick={() => removeAlloc(i)} className="p-1.5 rounded hover:bg-red-50 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-navy-700" /><span className="text-sm font-medium text-navy-700">Publish</span></label>
                <div className="flex gap-3 pt-1"><button onClick={close} className="btn-outline py-2.5 flex-1 text-sm">Cancel</button><button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 flex-1 text-sm">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>) : (<><Check className="w-4 h-4" /> {editing ? 'Update' : 'Create'}</>)}</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
