'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2, Check, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import type { Faq } from '@/types'

const CATS = ['general', 'donations', 'payments', 'transparency', 'volunteering', 'corporate', 'privacy', 'impact']
const EMPTY = { question:'', answer:'', category:'general', sort_order:0, is_active:true }

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [filterCat, setFilterCat] = useState('all')

  const supabase = createClient()
  const fetchFaqs = async () => {
    const { data } = await supabase.from('faqs').select('*').order('sort_order').order('created_at')
    setFaqs((data as Faq[]) || [])
    setLoading(false)
  }
  useEffect(() => { fetchFaqs() }, [])

  const openAdd = () => { setForm({ ...EMPTY, sort_order: faqs.length + 1 }); setEditing(null); setModal(true) }
  const openEdit = (f: Faq) => { setForm({ question:f.question, answer:f.answer, category:f.category, sort_order:f.sort_order, is_active:f.is_active }); setEditing(f); setModal(true) }
  const close = () => { setModal(false); setEditing(null) }

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) { toast.error('Question and answer are required.'); return }
    setSaving(true)
    try {
      if (editing) { const { error } = await supabase.from('faqs').update(form).eq('id', editing.id); if (error) throw error; toast.success('FAQ updated!') }
      else { const { error } = await supabase.from('faqs').insert(form); if (error) throw error; toast.success('FAQ added!') }
      await fetchFaqs(); close()
    } catch { toast.error('Save failed.') } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => { if (!confirm('Delete this FAQ?')) return; await supabase.from('faqs').delete().eq('id', id); toast.success('Deleted.'); fetchFaqs() }
  const handleToggle = async (id: string, val: boolean) => { await supabase.from('faqs').update({ is_active: val }).eq('id', id); setFaqs(prev => prev.map(f => f.id === id ? { ...f, is_active: val } : f)) }
  const displayed = filterCat === 'all' ? faqs : faqs.filter(f => f.category === filterCat)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold text-navy-900">FAQs</h1><p className="text-slate-400 text-sm mt-1">{faqs.length} questions</p></div><button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> Add FAQ</button></div>
      <div className="flex gap-2 flex-wrap">{['all', ...CATS].map(c => (<button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filterCat === c ? 'bg-navy-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{c}</button>))}</div>

      <div className="space-y-3">
        {loading ? (<div className="bg-white rounded-2xl p-12 text-center shadow-card"><Loader2 className="w-7 h-7 animate-spin text-navy-300 mx-auto" /></div>) : displayed.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card text-slate-400">No FAQs yet. <button onClick={openAdd} className="text-navy-700 font-semibold hover:underline">Add one</button></div>
        ) : displayed.map(faq => (
          <div key={faq.id} className={`bg-white rounded-2xl border shadow-card ${faq.is_active ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}>
            <div className="p-5"><div className="flex items-start justify-between gap-3 mb-2"><h3 className="font-semibold text-navy-800 text-sm">{faq.question}</h3><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 capitalize flex-shrink-0">{faq.category}</span></div><p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{faq.answer}</p></div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50 bg-slate-50/50 rounded-b-2xl">
              <button onClick={() => handleToggle(faq.id, !faq.is_active)} className="flex items-center gap-1.5 text-xs text-slate-500">{faq.is_active ? <ToggleRight className="w-4 h-4 text-forest-500" /> : <ToggleLeft className="w-4 h-4 text-slate-300" />}{faq.is_active ? 'Active' : 'Hidden'}</button>
              <div className="flex gap-1.5"><button onClick={() => openEdit(faq)} className="p-1.5 rounded-lg bg-white border border-slate-200"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(faq.id)} className="p-1.5 rounded-lg bg-white border border-slate-200 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10"><h2 className="font-display font-bold text-navy-900">{editing ? 'Edit FAQ' : 'New FAQ'}</h2><button onClick={close} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button></div>
              <div className="p-5 space-y-4">
                <div><label className="input-label">Question *</label><input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} className="input" /></div>
                <div><label className="input-label">Answer *</label><textarea rows={5} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} className="input resize-none" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="input-label">Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">{CATS.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}</select></div>
                  <div><label className="input-label">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) }))} className="input" /></div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-navy-700" /><span className="text-sm font-medium text-navy-700">Active</span></label>
                <div className="flex gap-3 pt-1"><button onClick={close} className="btn-outline py-2.5 flex-1 text-sm">Cancel</button><button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 flex-1 text-sm">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>) : (<><Check className="w-4 h-4" /> {editing ? 'Update' : 'Add'}</>)}</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
