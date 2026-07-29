'use client'
import { useEffect, useState, useCallback } from 'react'
import { Search, Download, Loader2, CheckCircle, Clock, XCircle, Receipt } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency, timeAgo } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import type { Order, OrderStatus } from '@/types'

const STATUS_FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' }, { value: 'refunded', label: 'Refunded' },
]
const STATUS_CONFIG = {
  paid: { icon: <CheckCircle className="w-3.5 h-3.5" />, cls: 'bg-green-50 text-green-700' },
  pending: { icon: <Clock className="w-3.5 h-3.5" />, cls: 'bg-amber-50 text-amber-700' },
  failed: { icon: <XCircle className="w-3.5 h-3.5" />, cls: 'bg-red-50 text-red-600' },
  refunded: { icon: <Receipt className="w-3.5 h-3.5" />, cls: 'bg-slate-100 text-slate-600' },
}

export default function AdminDonationsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ pageSize: '100' })
      if (status !== 'all') params.set('status', status)
      if (debouncedSearch) params.set('search', debouncedSearch)
      const res = await fetch(`/api/admin/donations?${params}`)
      const data = await res.json()
      if (data.success) { setOrders(data.data); setTotal(data.total) }
    } catch { toast.error('Failed to load donations.') } finally { setLoading(false) }
  }, [status, debouncedSearch])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const paidTotal = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total_amount, 0)

  const handleExportCsv = () => {
    const headers = ['Receipt', 'Donor Name', 'Email', 'Amount', 'Status', 'Date']
    const rows = orders.map(o => [o.receipt_number || o.id, o.donor_name, o.donor_email, o.total_amount, o.status, new Date(o.created_at).toLocaleDateString('en-IN')])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `donations-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-2xl font-bold text-navy-900">Donations</h1><p className="text-slate-400 text-sm mt-1">{total} total orders · {formatCurrency(paidTotal)} raised</p></div>
        <button onClick={handleExportCsv} className="flex items-center gap-2 bg-white border border-slate-200 hover:border-navy-300 text-navy-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all"><Download className="w-4 h-4" /> Export CSV</button>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or receipt..." className="input pl-9 text-sm py-2.5" /></div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">{STATUS_FILTERS.map(f => (<button key={f.value} onClick={() => setStatus(f.value)} className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${status === f.value ? 'bg-navy-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{f.label}</button>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden overflow-x-auto">
        {loading ? (<div className="p-12 text-center"><Loader2 className="w-7 h-7 animate-spin text-navy-300 mx-auto" /></div>) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No donations found.</div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100"><tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Receipt</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Donor</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Amount</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map(o => {
                const cfg = STATUS_CONFIG[o.status]
                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5"><code className="text-xs text-slate-500 font-mono">{o.receipt_number || o.id.slice(0, 10)}</code></td>
                    <td className="px-5 py-3.5"><div className="font-medium text-navy-800 text-sm">{o.donor_name}</div><div className="text-slate-400 text-xs">{o.donor_email}</div></td>
                    <td className="px-5 py-3.5 text-right font-bold text-navy-700 text-sm">{formatCurrency(o.total_amount)}</td>
                    <td className="px-5 py-3.5 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>{cfg.icon} {o.status}</span></td>
                    <td className="px-5 py-3.5 text-right text-slate-400 text-xs">{timeAgo(o.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
