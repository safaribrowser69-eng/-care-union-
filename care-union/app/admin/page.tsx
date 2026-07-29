'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Megaphone, Mail, ArrowUpRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatCurrency, timeAgo } from '@/lib/utils'
import type { Order, ContactSubmission } from '@/types'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRaised: 0, totalDonors: 0, activeCampaigns: 0, unreadMessages: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [recentMessages, setRecentMessages] = useState<ContactSubmission[]>([])

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      try {
        const [{ count: campaignCount }, { data: donorData }, { data: unreadMsgs }, { data: msgs }] = await Promise.all([
          supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('donor_wall').select('amount'),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
        ])
        const totalRaised = (donorData || []).reduce((s, d) => s + Number(d.amount), 0)
        setStats({ totalRaised, totalDonors: (donorData || []).length, activeCampaigns: campaignCount || 0, unreadMessages: (unreadMsgs as unknown as { length: number })?.length || 0 })
        setRecentMessages((msgs as ContactSubmission[]) || [])

        const ordersRes = await fetch('/api/admin/donations?pageSize=5')
        const ordersData = await ordersRes.json()
        if (ordersData.success) setRecentOrders(ordersData.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    load()
  }, [])

  const CARDS = [
    { label: 'Total Raised', value: formatCurrency(stats.totalRaised), icon: TrendingUp, color: '#2E7D32', href: '/admin/donations' },
    { label: 'Total Donors', value: stats.totalDonors.toLocaleString('en-IN'), icon: Users, color: '#1B3A6B', href: '/admin/donations' },
    { label: 'Active Campaigns', value: stats.activeCampaigns.toString(), icon: Megaphone, color: '#C8960C', href: '/admin/campaigns' },
    { label: 'Unread Messages', value: stats.unreadMessages.toString(), icon: Mail, color: '#7B3535', href: '/admin/contact' },
  ]

  if (loading) return (<div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 text-navy-300 animate-spin" /></div>)

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-bold text-navy-900">Dashboard Overview</h1><p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening with Care Union.</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((c, i) => {
          const Icon = c.icon
          return (
            <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href={c.href} className="block bg-white rounded-2xl p-5 shadow-card border border-slate-100 hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}15` }}><Icon className="w-5 h-5" style={{ color: c.color }} /></div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300" />
                </div>
                <div className="font-display font-bold text-navy-900 text-xl">{c.value}</div>
                <div className="text-slate-400 text-xs mt-1">{c.label}</div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><h2 className="font-semibold text-navy-800">Recent Donations</h2><Link href="/admin/donations" className="text-xs text-navy-700 font-semibold hover:underline">View All</Link></div>
          <div className="divide-y divide-slate-50">
            {recentOrders.length === 0 ? (<p className="text-center text-slate-400 text-sm py-10">No donations yet.</p>) : recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0"><div className="font-medium text-navy-800 text-sm truncate">{o.donor_name}</div><div className="text-slate-400 text-xs mt-0.5">{timeAgo(o.created_at)}</div></div>
                <div className="text-right flex-shrink-0"><div className="font-bold text-navy-700 text-sm">{formatCurrency(o.total_amount)}</div><span className={`text-[10px] font-semibold ${o.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{o.status}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><h2 className="font-semibold text-navy-800">Recent Messages</h2><Link href="/admin/contact" className="text-xs text-navy-700 font-semibold hover:underline">View All</Link></div>
          <div className="divide-y divide-slate-50">
            {recentMessages.length === 0 ? (<p className="text-center text-slate-400 text-sm py-10">No messages yet.</p>) : recentMessages.map(m => (
              <div key={m.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-2 mb-1"><span className="font-medium text-navy-800 text-sm truncate">{m.name}</span>{!m.is_read && <span className="w-2 h-2 bg-navy-600 rounded-full flex-shrink-0" />}</div>
                <div className="text-slate-500 text-xs truncate">{m.subject}</div>
                <div className="text-slate-300 text-[10px] mt-1">{timeAgo(m.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
