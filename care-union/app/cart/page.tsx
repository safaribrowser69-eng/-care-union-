'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { CATEGORY_META } from '@/types'

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-68px)] bg-slate-50 flex items-center justify-center px-5 py-20">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-9 h-9 text-slate-300" />
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-900 mb-2">Your Cart is Empty</h1>
          <p className="text-slate-400 text-sm mb-8">Browse campaigns and add donations to get started.</p>
          <Link href="/campaigns" className="btn-primary py-3 px-7">Browse Campaigns</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-5 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-8">Your Donation Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map(item => {
                const meta = CATEGORY_META[item.campaign_category]
                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.campaign_image} alt={item.campaign_title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs" style={{ color: meta.color }}>{meta.icon} {meta.label}</span>
                      </div>
                      <div className="font-semibold text-navy-800 text-sm truncate">{item.campaign_title}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{item.option_icon} {item.option_name} · {formatCurrency(item.unit_price)} each</div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= item.min_qty} className="p-1.5 hover:bg-slate-50 disabled:opacity-30 transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-semibold text-navy-800 w-7 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1.5 hover:bg-slate-50 transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-navy-700 text-sm">{formatCurrency(item.subtotal)}</span>
                          <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors" aria-label="Remove item"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <div>
            <div className="sticky top-24 bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <h2 className="font-display font-bold text-navy-800 text-lg mb-5">Order Summary</h2>
              <div className="space-y-2.5 mb-5 pb-5 border-b border-slate-100">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Items ({items.reduce((s, i) => s + i.quantity, 0)})</span><span className="font-medium text-navy-700">{formatCurrency(total())}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Processing Fee</span><span className="font-medium text-forest-600">Free</span></div>
              </div>
              <div className="flex justify-between mb-6"><span className="font-bold text-navy-900">Total</span><span className="font-display font-bold text-navy-900 text-xl">{formatCurrency(total())}</span></div>
              <Link href="/checkout" className="btn-primary w-full py-3.5 mb-3">Proceed to Checkout <ArrowRight className="w-4 h-4" /></Link>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="w-3.5 h-3.5" /> Secure payment via Razorpay</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
