'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2, Check, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { formatCurrency, progressPercent, slugify } from '@/lib/utils'
import { CATEGORY_META } from '@/types'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Campaign, CampaignCategory, DonationOption } from '@/types'

const EMPTY_CAMPAIGN = { title:'', slug:'', category:'hunger' as CampaignCategory, short_desc:'', description:'', image_url:'', goal_amount:100000, beneficiaries:0, location:'India', is_active:true, is_featured:false, sort_order:0 }
const EMPTY_OPTION = { name:'', description:'', price:100, min_qty:1, max_qty:999, icon:'🎁', is_active:true, sort_order:0 }

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState({ ...EMPTY_CAMPAIGN })
  const [saving, setSaving] = useState(false)
  const [optionsModal, setOptionsModal] = useState<Campaign | null>(null)

  const supabase = createClient()

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('campaigns').select('*, donation_options(*)').order('sort_order')
    setCampaigns((data as Campaign[]) || [])
    setLoading(false)
  }
  useEffect(() => { fetchCampaigns() }, [])

  const openAdd = () => { setForm({ ...EMPTY_CAMPAIGN, sort_order: campaigns.length + 1 }); setEditing(null); setModal(true) }
  const openEdit = (c: Campaign) => {
    setForm({ title:c.title, slug:c.slug, category:c.category, short_desc:c.short_desc, description:c.description, image_url:c.image_url, goal_amount:c.goal_amount, beneficiaries:c.beneficiaries, location:c.location, is_active:c.is_active, is_featured:c.is_featured, sort_order:c.sort_order })
    setEditing(c); setModal(true)
  }
  const close = () => { setModal(false); setEditing(null) }

  const handleSave = async () => {
    if (!form.title.trim() || !form.short_desc.trim() || !form.description.trim() || !form.image_url) { toast.error('Please fill all required fields.'); return }
    setSaving(true)
    try {
      const slug = form.slug || slugify(form.title)
      if (editing) {
        const { error } = await supabase.from('campaigns').update({ ...form, slug }).eq('id', editing.id)
        if (error) throw error
        toast.success('Campaign updated!')
      } else {
        const { error } = await supabase.from('campaigns').insert({ ...form, slug, gallery_images: [] })
        if (error) throw error
        toast.success('Campaign created!')
      }
      await fetchCampaigns(); close()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Save failed.') } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign? This will also delete all its donation options.')) return
    const { error } = await supabase.from('campaigns').delete().eq('id', id)
    if (error) { toast.error('Delete failed.'); return }
    toast.success('Campaign deleted.')
    fetchCampaigns()
  }

  const handleToggle = async (id: string, field: 'is_active' | 'is_featured', val: boolean) => {
    await supabase.from('campaigns').update({ [field]: val }).eq('id', id)
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-2xl font-bold text-navy-900">Campaigns</h1><p className="text-slate-400 text-sm mt-1">{campaigns.length} total</p></div>
        <button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> New Campaign</button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-7 h-7 animate-spin text-navy-300 mx-auto" /></div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No campaigns yet. <button onClick={openAdd} className="text-navy-700 font-semibold hover:underline">Create one</button></div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-100"><tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Campaign</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Progress</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Active</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Featured</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {campaigns.map(c => {
                const meta = CATEGORY_META[c.category]
                const percent = progressPercent(c.raised_amount, c.goal_amount)
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4"><div className="font-semibold text-navy-800 text-sm">{c.title}</div><div className="text-slate-400 text-xs mt-0.5">/{c.slug}</div></td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${meta.color}15`, color: meta.color }}>{meta.icon} {meta.label}</span></td>
                    <td className="px-5 py-4 min-w-[140px]"><div className="text-xs text-slate-500 mb-1">{formatCurrency(c.raised_amount)} / {formatCurrency(c.goal_amount)}</div><div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${percent}%`, background: meta.color }} /></div></td>
                    <td className="px-5 py-4 text-center"><button onClick={() => handleToggle(c.id, 'is_active', !c.is_active)}>{c.is_active ? <ToggleRight className="w-6 h-6 text-forest-500 mx-auto" /> : <ToggleLeft className="w-6 h-6 text-slate-300 mx-auto" />}</button></td>
                    <td className="px-5 py-4 text-center"><button onClick={() => handleToggle(c.id, 'is_featured', !c.is_featured)}><Star className={`w-5 h-5 mx-auto ${c.is_featured ? 'fill-gold-500 text-gold-500' : 'text-slate-300'}`} /></button></td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-1.5">
                      <button onClick={() => setOptionsModal(c)} className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-navy-100 hover:text-navy-700 text-xs font-semibold transition-colors">Options ({c.donation_options?.length || 0})</button>
                      <button onClick={() => openEdit(c)} className="p-2 rounded-lg bg-slate-100 hover:bg-navy-100 hover:text-navy-700 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10"><h2 className="font-display font-bold text-navy-900">{editing ? 'Edit Campaign' : 'New Campaign'}</h2><button onClick={close} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4 text-slate-500" /></button></div>
              <div className="p-5 space-y-4">
                <div><label className="input-label">Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))} className="input" placeholder="Feed the Hungry" /></div>
                <div><label className="input-label">URL Slug</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} className="input" placeholder="feed-the-hungry" /></div>
                <div><label className="input-label">Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as CampaignCategory }))} className="input">{Object.entries(CATEGORY_META).map(([k, m]) => <option key={k} value={k}>{m.icon} {m.label}</option>)}</select></div>
                <div><label className="input-label">Short Description *</label><input value={form.short_desc} onChange={e => setForm(f => ({ ...f, short_desc: e.target.value }))} className="input" placeholder="One-line summary shown on cards" /></div>
                <div><label className="input-label">Full Description *</label><textarea rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input resize-none" placeholder="Detailed campaign description..." /></div>
                <ImageUpload value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} folder="campaigns" label="Campaign Image *" aspectRatio="16/9" />
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="input-label">Goal Amount (₹)</label><input type="number" value={form.goal_amount} onChange={e => setForm(f => ({ ...f, goal_amount: parseFloat(e.target.value) }))} className="input" min={0} /></div>
                  <div><label className="input-label">Beneficiaries</label><input type="number" value={form.beneficiaries} onChange={e => setForm(f => ({ ...f, beneficiaries: parseInt(e.target.value) }))} className="input" min={0} /></div>
                </div>
                <div><label className="input-label">Location</label><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input" placeholder="Delhi, Mumbai, Pune" /></div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-navy-700" /><span className="text-sm font-medium text-navy-700">Active</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-navy-700" /><span className="text-sm font-medium text-navy-700">Featured</span></label>
                </div>
                <div className="flex gap-3 pt-1"><button onClick={close} className="btn-outline py-2.5 flex-1 text-sm">Cancel</button><button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 flex-1 text-sm">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>) : (<><Check className="w-4 h-4" /> {editing ? 'Update' : 'Create'}</>)}</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {optionsModal && (<DonationOptionsModal campaign={optionsModal} onClose={() => setOptionsModal(null)} onUpdate={fetchCampaigns} />)}
    </div>
  )
}

function DonationOptionsModal({ campaign, onClose, onUpdate }: { campaign: Campaign; onClose: () => void; onUpdate: () => void }) {
  const [options, setOptions] = useState<DonationOption[]>(campaign.donation_options || [])
  const [form, setForm] = useState({ ...EMPTY_OPTION })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const refreshOptions = async () => {
    const { data } = await supabase.from('donation_options').select('*').eq('campaign_id', campaign.id).order('sort_order')
    setOptions((data as DonationOption[]) || [])
  }

  const handleAdd = async () => {
    if (!form.name.trim() || !form.price) { toast.error('Name and price are required.'); return }
    setSaving(true)
    try {
      if (editingId) {
        const { error } = await supabase.from('donation_options').update(form).eq('id', editingId)
        if (error) throw error
        toast.success('Option updated!')
      } else {
        const { error } = await supabase.from('donation_options').insert({ ...form, campaign_id: campaign.id })
        if (error) throw error
        toast.success('Option added!')
      }
      await refreshOptions(); onUpdate()
      setForm({ ...EMPTY_OPTION }); setEditingId(null)
    } catch { toast.error('Save failed.') } finally { setSaving(false) }
  }

  const handleEditOption = (o: DonationOption) => {
    setForm({ name:o.name, description:o.description||'', price:o.price, min_qty:o.min_qty, max_qty:o.max_qty, icon:o.icon, is_active:o.is_active, sort_order:o.sort_order })
    setEditingId(o.id)
  }

  const handleDeleteOption = async (id: string) => {
    if (!confirm('Delete this donation option?')) return
    await supabase.from('donation_options').delete().eq('id', id)
    await refreshOptions(); onUpdate()
    toast.success('Option deleted.')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10"><h2 className="font-display font-bold text-navy-900">Donation Options — {campaign.title}</h2><button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4 text-slate-500" /></button></div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input py-2 text-sm" placeholder="Option name" />
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="input py-2 text-sm" placeholder="Emoji icon" maxLength={4} />
            </div>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input py-2 text-sm" placeholder="Description (optional)" />
            <div className="grid grid-cols-3 gap-3">
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} className="input py-2 text-sm" placeholder="Price ₹" min={1} />
              <input type="number" value={form.min_qty} onChange={e => setForm(f => ({ ...f, min_qty: parseInt(e.target.value) }))} className="input py-2 text-sm" placeholder="Min qty" min={1} />
              <input type="number" value={form.max_qty} onChange={e => setForm(f => ({ ...f, max_qty: parseInt(e.target.value) }))} className="input py-2 text-sm" placeholder="Max qty" min={1} />
            </div>
            <button onClick={handleAdd} disabled={saving} className="btn-primary py-2 px-5 text-xs w-full">{saving ? 'Saving...' : editingId ? 'Update Option' : 'Add Option'}</button>
            {editingId && (<button onClick={() => { setForm({ ...EMPTY_OPTION }); setEditingId(null) }} className="text-xs text-slate-400 hover:text-slate-600 w-full text-center">Cancel Edit</button>)}
          </div>
          <div className="space-y-2">
            {options.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2.5"><span className="text-xl">{o.icon}</span><div><div className="font-medium text-navy-800 text-sm">{o.name}</div><div className="text-slate-400 text-xs">{formatCurrency(o.price)} · min {o.min_qty}</div></div></div>
                <div className="flex gap-1.5"><button onClick={() => handleEditOption(o)} className="p-1.5 rounded-lg hover:bg-slate-100"><Pencil className="w-3.5 h-3.5 text-slate-500" /></button><button onClick={() => handleDeleteOption(o.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
