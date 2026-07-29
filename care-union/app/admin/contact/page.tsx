'use client'
import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Mail, MailOpen, Trash2, X, Search, Phone, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { timeAgo } from '@/lib/utils'
import type { ContactSubmission } from '@/types'

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const supabase = createClient()

  const fetchSubmissions = async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    setSubmissions((data as ContactSubmission[]) || [])
    setLoading(false)
  }
  useEffect(() => { fetchSubmissions() }, [])

  const markRead = async (id: string) => { await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id); setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_read: true } : s)) }
  const handleOpen = (s: ContactSubmission) => { setSelected(s); if (!s.is_read) markRead(s.id) }
  const handleDelete = async (id: string, e: React.MouseEvent) => { e.stopPropagation(); if (!confirm('Delete this message?')) return; await supabase.from('contact_submissions').delete().eq('id', id); toast.success('Deleted.'); setSubmissions(prev => prev.filter(s => s.id !== id)); if (selected?.id === id) setSelected(null) }
  const markAllRead = async () => { await supabase.from('contact_submissions').update({ is_read: true }).eq('is_read', false); setSubmissions(prev => prev.map(s => ({ ...s, is_read: true }))); toast.success('All marked read.') }

  const filtered = useMemo(() => submissions.filter(s => {
    const matchFilter = filter === 'all' || (filter === 'unread' && !s.is_read) || (filter === 'read' && s.is_read)
    const q = search.toLowerCase()
    const matchSearch = !search || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q)
    return matchFilter && matchSearch
  }), [submissions, filter, search])

  const unreadCount = submissions.filter(s => !s.is_read).length

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="font-display text-2xl font-bold text-navy-900">Contact Messages</h1><p className="text-slate-400 text-sm mt-1">{unreadCount > 0 ? <span className="text-amber-600 font-semibold">{unreadCount} unread</span> : 'All caught up!'} · {submissions.length} total</p></div>
        {unreadCount > 0 && (<button onClick={markAllRead} className="flex items-center gap-2 bg-white border border-slate-200 hover:border-navy-300 text-navy-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all"><CheckCircle className="w-4 h-4" /> Mark All Read</button>)}
      </div>

      <div className="flex gap-4 flex-col lg:flex-row h-[calc(100vh-240px)]">
        <div className="lg:w-2/5 flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="input pl-9 text-sm py-2.5" /></div>
            <select value={filter} onChange={e => setFilter(e.target.value as 'all'|'unread'|'read')} className="input text-sm py-2.5 w-auto pr-8"><option value="all">All</option><option value="unread">Unread</option><option value="read">Read</option></select>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading ? (<div className="bg-white rounded-2xl p-8 text-center shadow-card"><div className="w-6 h-6 border-2 border-navy-200 border-t-navy-700 rounded-full animate-spin mx-auto" /></div>) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card text-slate-400 text-sm">No messages found.</div>
            ) : filtered.map(s => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={() => handleOpen(s)} className={`bg-white rounded-xl border cursor-pointer transition-all p-4 group ${selected?.id === s.id ? 'border-navy-400 shadow-md' : !s.is_read ? 'border-navy-200 shadow-sm' : 'border-slate-100'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 ${!s.is_read ? 'text-navy-600' : 'text-slate-300'}`}>{s.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2"><span className={`text-sm font-semibold truncate ${!s.is_read ? 'text-navy-900' : 'text-slate-600'}`}>{s.name}</span><div className="flex items-center gap-1.5 flex-shrink-0"><span className="text-[10px] text-slate-400">{timeAgo(s.created_at)}</span><button onClick={e => handleDelete(s.id, e)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500"><Trash2 className="w-3 h-3" /></button></div></div>
                    <div className={`text-xs mt-0.5 ${!s.is_read ? 'font-semibold text-navy-600' : 'text-slate-500'}`}>{s.subject}</div>
                    <div className="text-xs text-slate-400 mt-1 truncate">{s.message}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card border border-slate-100 h-full overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-100"><h2 className="font-semibold text-navy-900">{selected.subject}</h2><button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4 text-slate-400" /></button></div>
              <div className="p-6 space-y-5 flex-1">
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm"><div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{selected.name[0].toUpperCase()}</div><div><div className="font-semibold text-navy-800">{selected.name}</div><a href={`mailto:${selected.email}`} className="text-xs text-navy-600 hover:underline">{selected.email}</a></div></div>
                  {selected.phone && (<div className="flex items-center gap-2 text-xs text-slate-500"><Phone className="w-3.5 h-3.5" /><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>)}
                  <div className="flex items-center gap-2 text-xs text-slate-400"><Clock className="w-3.5 h-3.5" />{new Date(selected.created_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</div>
                </div>
                <div><div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Message</div><div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-4">{selected.message}</div></div>
                <div className="flex gap-3">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary py-2.5 px-5 flex-1 text-sm text-center">Reply via Email</a>
                  {selected.phone && (<a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=Hi ${selected.name}!`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5c] text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-all flex-1">WhatsApp</a>)}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 h-full flex items-center justify-center"><div className="text-center text-slate-300"><Mail className="w-14 h-14 mx-auto mb-3 opacity-50" /><p className="text-sm">Select a message to read</p></div></div>
          )}
        </div>
      </div>
    </div>
  )
}
