'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2, Check, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { HomepageBanner } from '@/types'

const EMPTY = { title:'', subtitle:'', image_url:'', cta_text:'Donate Now', cta_link:'/campaigns', sort_order:1, is_active:true }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<HomepageBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<HomepageBanner | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchBanners = async () => { const { data } = await supabase.from('homepage_banners').select('*').order('sort_order'); setBanners((data as HomepageBanner[]) || []); setLoading(false) }
  useEffect(() => { fetchBanners() }, [])

  const openAdd = () => { setForm({ ...EMPTY, sort_order: banners.length + 1 }); setEditing(null); setModal(true) }
  const openEdit = (b: HomepageBanner) => { setForm({ title:b.title, subtitle:b.subtitle||'', image_url:b.image_url, cta_text:b.cta_text, cta_link:b.cta_link, sort_order:b.sort_order, is_active:b.is_active }); setEditing(b); setModal(true) }
  const close = () => { setModal(false); setEditing(null) }

  const handleSave = async () => {
    if (!form.title || !form.image_url) { toast.error('Title and image are required.'); return }
    setSaving(true)
    try {
      if (editing) { const { error } = await supabase.from('homepage_banners').update(form).eq('id', editing.id); if (error) throw error; toast.success('Updated!') }
      else { const { error } = await supabase.from('homepage_banners').insert(form); if (error) throw error; toast.success('Added!') }
      await fetchBanners(); close()
    } catch { toast.error('Save failed.') } finally { setSaving(false) }
  }
  const handleDelete = async (id: string) => { if (!confirm('Delete this banner?')) return; await supabase.from('homepage_banners').delete().eq('id', id); toast.success('Deleted.'); fetchBanners() }
  const handleToggle = async (id: string, val: boolean) => { await supabase.from('homepage_banners').update({ is_active: val }).eq('id', id); setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: val } : b)) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold text-navy-900">Homepage Banners</h1><p className="text-slate-400 text-sm mt-1">{banners.length} banners</p></div><button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> Add Banner</button></div>

      {loading ? (<div className="bg-white rounded-2xl p-12 text-center shadow-card"><Loader2 className="w-7 h-7 animate-spin text-navy-300 mx-auto" /></div>) : (
        <div className="grid gap-4">
          {banners.map(banner => (
            <div key={banner.id} className={`bg-white rounded-2xl border shadow-card overflow-hidden ${!banner.is_active ? 'opacity-60' : ''}`}>
              <div className="flex gap-4 p-4">
                <div className="relative w-40 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">{banner.image_url && <Image src={banner.image_url} alt={banner.title} fill className="object-cover" />}</div>
                <div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-3">
                  <div><div className="font-semibold text-navy-800">{banner.title}</div>{banner.subtitle && <div className="text-slate-500 text-xs mt-1 line-clamp-2">{banner.subtitle}</div>}</div>
                  <div className="flex items-center gap-1.5 flex-shrink-0"><button onClick={() => handleToggle(banner.id, !banner.is_active)}>{banner.is_active ? <ToggleRight className="w-6 h-6 text-forest-500" /> : <ToggleLeft className="w-6 h-6 text-slate-300" />}</button><button onClick={() => openEdit(banner)} className="p-2 rounded-lg bg-slate-100"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(banner.id)} className="p-2 rounded-lg bg-slate-100 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div>
                </div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10"><h2 className="font-display font-bold text-navy-900">{editing ? 'Edit Banner' : 'New Banner'}</h2><button onClick={close} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button></div>
              <div className="p-5 space-y-4">
                <div><label className="input-label">Headline *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" /></div>
                <div><label className="input-label">Subheadline</label><textarea rows={2} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="input resize-none" /></div>
                <ImageUpload value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} folder="banners" label="Banner Image *" aspectRatio="16/9" />
                <div className="grid grid-cols-2 gap-3"><div><label className="input-label">Button Text</label><input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} className="input" /></div><div><label className="input-label">Button Link</label><input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} className="input" /></div></div>
                <div><label className="input-label">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) }))} className="input" min={1} /></div>
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
