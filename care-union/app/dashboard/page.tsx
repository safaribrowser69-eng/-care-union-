'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, User, LogOut, ChevronRight, Download, CheckCircle, Clock, XCircle, Receipt, Loader2 } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { formatCurrency, timeAgo } from '@/lib/utils'
import { INDIAN_STATES } from '@/types'
import type { Order } from '@/types'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  paid: { label: 'Paid', icon: <CheckCircle className="w-3.5 h-3.5" />, cls: 'bg-green-50 text-green-700' },
  pending: { label: 'Pending', icon: <Clock className="w-3.5 h-3.5" />, cls: 'bg-amber-50 text-amber-700' },
  failed: { label: 'Failed', icon: <XCircle className="w-3.5 h-3.5" />, cls: 'bg-red-50 text-red-600' },
  refunded: { label: 'Refunded', icon: <Receipt className="w-3.5 h-3.5" />, cls: 'bg-slate-100 text-slate-600' },
} as const

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useUserStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'donations' | 'profile'>('donations')
  const [profile, setProfile] = useState({ name: '', phone: '', city: '', state: '', pincode: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/dashboard'); return }
    setProfile({ name: user.name || '', phone: user.phone || '', city: user.city || '', state: user.state || '', pincode: user.pincode || '' })
  }, [user, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/users/orders').then(r => r.json()).then(d => { if (d.success) setOrders(d.data); else toast.error('Failed to load donations.') }).catch(() => toast.error('Could not fetch donation history.')).finally(() => setLoading(false))
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
      const data = await res.json()
      if (data.success) toast.success('Profile updated!')
      else toast.error(data.message || 'Failed to update profile.')
    } catch { toast.error('Failed to update profile.') } finally { setSaving(false) }
  }

  const handleLogout = () => { logout(); router.push('/') }
  if (!user) return null

  const paidOrders = orders.filter(o => o.status === 'paid')
  const totalDonated = paidOrders.reduce((s, o) => s + o.total_amount, 0)
  const campaignsCount = new Set(orders.flatMap(o => (o.items || []).map(i => i.campaign_id).filter(Boolean))).size

  const TABS = [
    { key: 'donations' as const, label: 'My Donations', icon: <Heart className="w-4 h-4" /> },
    { key: 'profile' as const, label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-5 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden mb-6">
          <div className="bg-gradient-navy px-8 py-8">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center font-display text-2xl font-bold text-white flex-shrink-0">{(user.name?.[0] || user.email[0]).toUpperCase()}</div>
              <div className="flex-1 min-w-0"><h1 className="font-display text-2xl font-bold text-white leading-tight truncate">{user.name || 'Valued Donor'}</h1><p className="text-white/60 text-sm mt-0.5 truncate">{user.email}</p></div>
              <div className="flex gap-3 flex-shrink-0">
                <Link href="/campaigns" className="flex items-center gap-1.5 bg-forest-500 hover:bg-forest-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"><Heart className="w-3.5 h-3.5 fill-current" /> Donate Again</Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"><LogOut className="w-3.5 h-3.5" /> Logout</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-7">
              {[{ label: 'Total Donated', value: formatCurrency(totalDonated) }, { label: 'Campaigns Supported', value: campaignsCount.toString() }, { label: 'Donations Made', value: orders.length.toString() }].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center"><div className="font-display text-xl font-bold text-white">{s.value}</div><div className="text-white/50 text-xs mt-0.5">{s.label}</div></div>
              ))}
            </div>
          </div>
          <div className="flex border-b border-slate-100">
            {TABS.map(tab => (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${activeTab === tab.key ? 'border-navy-700 text-navy-700' : 'border-transparent text-slate-500 hover:text-navy-700 hover:border-navy-200'}`}>{tab.icon} {tab.label}</button>))}
          </div>
        </div>

        {activeTab === 'donations' && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-slate-100"><Loader2 className="w-8 h-8 text-navy-300 animate-spin mx-auto mb-3" /><p className="text-slate-400 text-sm">Loading your donation history…</p></div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-14 text-center shadow-card border border-slate-100"><div className="text-5xl mb-4">💛</div><h3 className="font-display text-xl font-bold text-navy-800 mb-2">No donations yet</h3><p className="text-slate-400 text-sm mb-7">Your first donation will appear here.</p><Link href="/campaigns" className="btn-primary py-3 px-7"><Heart className="w-4 h-4 fill-current" /> Start Donating</Link></div>
            ) : orders.map((order, i) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                    <div className="flex items-center gap-3 flex-wrap"><code className="text-xs text-slate-400 font-mono">{order.receipt_number || order.id.slice(0, 12).toUpperCase()}</code><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>{cfg.icon} {cfg.label}</span></div>
                    <div className="text-right flex-shrink-0"><div className="font-bold text-navy-700">{formatCurrency(order.total_amount)}</div><div className="text-xs text-slate-400 mt-0.5">{timeAgo(order.created_at)}</div></div>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="px-6 py-4 space-y-2.5">
                      {order.items.map(item => (<div key={item.id} className="flex items-center justify-between text-sm"><span className="text-slate-600 flex items-center gap-2 min-w-0"><span className="text-base flex-shrink-0">🎁</span><span className="truncate">{item.option_name}<span className="text-slate-400 ml-1">× {item.quantity}</span></span></span><span className="font-semibold text-navy-700 flex-shrink-0 ml-4">{formatCurrency(item.subtotal)}</span></div>))}
                    </div>
                  )}
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-400">{order.donor_city && `📍 ${order.donor_city}`}</div>
                    {order.status === 'paid' && (<button onClick={() => toast('Receipt download coming soon.', { icon: '📧' })} className="flex items-center gap-1.5 text-xs text-navy-700 font-semibold hover:text-navy-900 transition-colors"><Download className="w-3.5 h-3.5" /> Download Receipt</button>)}
                  </div>
                </motion.div>
              )
            })}
            {orders.length > 0 && (<div className="text-center pt-4"><Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-navy-700 font-semibold hover:text-navy-900 transition-colors"><Heart className="w-4 h-4 fill-current text-red-400" /> Make Another Donation <ChevronRight className="w-4 h-4" /></Link></div>)}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100"><h2 className="font-display font-bold text-navy-800 text-lg">Profile Details</h2><p className="text-slate-400 text-xs mt-1">Update your details for faster checkout and 80G receipts.</p></div>
            <form onSubmit={handleSaveProfile} className="p-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="input-label">Full Name</label><input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input" placeholder="As per PAN card" /></div>
                <div><label className="input-label">Email Address</label><input value={user.email} disabled className="input opacity-60 cursor-not-allowed bg-slate-100" /><p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="input-label">Mobile Number</label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input" placeholder="+91 XXXXX XXXXX" maxLength={13} /></div>
                <div><label className="input-label">City</label><input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} className="input" placeholder="Your city" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="input-label">State</label><select value={profile.state} onChange={e => setProfile(p => ({ ...p, state: e.target.value }))} className="input"><option value="">Select state</option>{INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="input-label">Pincode</label><input value={profile.pincode} onChange={e => setProfile(p => ({ ...p, pincode: e.target.value }))} className="input" placeholder="000000" maxLength={6} /></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button type="submit" disabled={saving} className="btn-primary py-3 px-8">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>) : ('Save Changes')}</button>
                <p className="text-xs text-slate-400">Need help? <a href="mailto:careunion.info@gmail.com" className="text-navy-700 hover:underline font-medium">Contact us</a></p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
