'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Gallery } from '@/types'

const CATEGORIES = ['general', 'hunger', 'birthday', 'animals', 'nature', 'medicine']
const EMPTY = { title:'', description:'', image_url:'', category:'general', drive_name:'', location:'', drive_date:'', sort_order:0, is_active:true }

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Gallery | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()
  const fetchItems = async () => {
    const { data } = await supabase.from('gallery').select('*').order('sort_order').order('created_at', { ascending: false })
    setItems((data as Gallery[]) || [])
    setLoading(false)
  }
  useEffect(() => { fetchItems() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setEditing(null); setModal(true) }
  const openEdit = (g: Gallery) => {
    setForm({ title:g.title, description:g.description||'', image_url:g.image_url, category:g.category, drive_name:g.drive_name||'', location:g.location||'', drive_date:g.drive_date||'', sort_order:g.sort_order, is_active:g.is_active })
    setEditing(g); setModal(true)
  }
  const close = () => { setModal(false); setEditing(null) }

  const handleSave = async () => {
    if (!form.title.trim() || !form.image_url) { toast.error('Title and image are required.'); return }
    setSaving(true)
    try {
      if (editing) { const { error } = await supabase.from('gallery').update(form).eq('id', editing.id); if (error) throw error; toast.success('Updated!') }
      else { const { error } = await supabase.from('gallery').insert(form); if (error) throw error; toast.success('Added!') }
      await fetchItems(); close()
    } catch { toast.error('Save failed.') } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return
    await supabase.from('gallery').delete().eq('id', id)
    toast.success('Deleted.')
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold text-navy-900">Gallery</h1><p className="text-slate-400 text-sm mt-1">{items.length} photos</p></div><button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> Add Photo</button></div>

      {loading ? (<div className="bg-white rounded-2xl p-12 text-center shadow-card"><Loader2 className="w-7 h-7 animate-spin text-navy-300 mx-auto" /></div>) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-card text-slate-400">No photos yet. <button onClick={openAdd} className="text-navy-700 font-semibold hover:underline">Add one</button></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden group">
              <div className="relative aspect-square"><Image src={item.image_url} alt={item.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 bg-white rounded-lg hover:bg-slate-100"><Pencil className="w-4 h-4 text-navy-700" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="p-3"><div className="font-medium text-navy-800 text-xs truncate">{item.title}</div><div className="text-slate-400 text-[10px] mt-0.5 capitalize">{item.category}</div></div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10"><h2 className="font-display font-bold text-navy-900">{editing ? 'Edit Photo' : 'Add Photo'}</h2><button onClick={close} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button></div>
              <div className="p-5 space-y-4">
                <div><label className="input-label">Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" /></div>
                <div><label className="input-label">Description</label><textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input resize-none" /></div>
                <ImageUpload value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} folder="gallery" label="Photo *" aspectRatio="4/3" />
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="input-label">Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">{CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}</select></div>
                  <div><label className="input-label">Drive Name</label><input value={form.drive_name} onChange={e => setForm(f => ({ ...f, drive_name: e.target.value }))} className="input" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="input-label">Location</label><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input" /></div>
                  <div><label className="input-label">Drive Date</label><input type="date" value={form.drive_date} onChange={e => setForm(f => ({ ...f, drive_date: e.target.value }))} className="input" /></div>
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
