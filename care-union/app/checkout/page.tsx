'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { motion } from 'framer-motion'
import { ShieldCheck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useUserStore } from '@/store/userStore'
import { formatCurrency, razorpayOptions } from '@/lib/utils'
import { INDIAN_STATES } from '@/types'

declare global { interface Window { Razorpay: new (options: unknown) => { open: () => void } } }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const { user } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    pan: user?.pan_number || '', address: '', city: user?.city || '', state: user?.state || '', pincode: user?.pincode || '',
    is_anonymous: false,
  })

  useEffect(() => { if (items.length === 0) router.push('/cart') }, [items.length, router])
  if (items.length === 0) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ campaign_id: i.campaign_id, donation_option_id: i.donation_option_id, campaign_title: i.campaign_title, option_name: i.option_name, unit_price: i.unit_price, quantity: i.quantity })),
          donor: { name: form.name, email: form.email, phone: form.phone, pan: form.pan, address: form.address, city: form.city, state: form.state, pincode: form.pincode },
          is_anonymous: form.is_anonymous,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderData.success) { toast.error(orderData.message || 'Failed to create order.'); setLoading(false); return }

      const options = razorpayOptions({
        key: orderData.key_id, amount: orderData.amount, currency: orderData.currency, orderId: orderData.razorpay_order_id,
        name: 'Care Union Foundation', description: `Donation — ${items.length} item(s)`,
        prefillName: form.name, prefillEmail: form.email, prefillPhone: form.phone,
        onSuccess: async (response) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, order_id: orderData.order_id }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            clearCart()
            router.push(`/thank-you?receipt=${verifyData.receipt_number}&name=${encodeURIComponent(form.name)}&amount=${total()}`)
          } else {
            toast.error('Payment verification failed. Contact support if amount was deducted.')
          }
          setLoading(false)
        },
        onFailure: () => { setLoading(false); toast.error('Payment cancelled.') },
      })

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-slate-50 py-10 px-5 md:px-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-navy-900 mb-8">Complete Your Donation</h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-slate-100 p-7 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="input-label">Full Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="As per PAN card" /></div>
              <div><label className="input-label">Email *</label><input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input" placeholder="you@example.com" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="input-label">Mobile Number *</label><input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+91 XXXXX XXXXX" /></div>
              <div><label className="input-label">PAN (for 80G receipt)</label><input value={form.pan} onChange={e => setForm(f => ({ ...f, pan: e.target.value.toUpperCase() }))} className="input" placeholder="ABCDE1234F" maxLength={10} /></div>
            </div>
            <div><label className="input-label">Address</label><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input" placeholder="Street address" /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="input-label">City</label><input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input" placeholder="City" /></div>
              <div><label className="input-label">State</label><select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="input"><option value="">Select</option>{INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="input-label">Pincode</label><input value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} className="input" placeholder="000000" maxLength={6} /></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_anonymous} onChange={e => setForm(f => ({ ...f, is_anonymous: e.target.checked }))} className="w-4 h-4 accent-navy-700" />
              <span className="text-sm text-navy-700">Donate anonymously (hide my name from donor wall)</span>
            </label>

            <div className="bg-slate-50 rounded-xl p-5 flex items-center justify-between">
              <span className="font-semibold text-navy-800">Total Amount</span>
              <span className="font-display font-bold text-navy-900 text-2xl">{formatCurrency(total())}</span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>) : (`Pay ${formatCurrency(total())} Securely`)}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="w-3.5 h-3.5" /> Secured by Razorpay · 256-bit SSL encryption</div>
          </form>
        </div>
      </div>
    </>
  )
}
