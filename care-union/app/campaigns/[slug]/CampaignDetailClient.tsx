'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, MapPin, Users, Minus, Plus, ShoppingCart, Heart, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency, progressPercent, slugify } from '@/lib/utils'
import { CATEGORY_META } from '@/types'
import { useCartStore } from '@/store/cartStore'
import type { Campaign, DonationOption } from '@/types'

export function CampaignDetailClient({ campaign }: { campaign: Campaign }) {
  const meta = CATEGORY_META[campaign.category]
  const percent = progressPercent(campaign.raised_amount, campaign.goal_amount)
  const options = (campaign.donation_options || []).filter(o => o.is_active).sort((a, b) => a.sort_order - b.sort_order)
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(options.map(o => [o.id, o.min_qty]))
  )
  const addItem = useCartStore(s => s.addItem)

  const updateQty = (optionId: string, delta: number, option: DonationOption) => {
    setQuantities(prev => {
      const current = prev[optionId] || option.min_qty
      const next = Math.max(option.min_qty, Math.min(option.max_qty, current + delta))
      return { ...prev, [optionId]: next }
    })
  }

  const handleAddToCart = (option: DonationOption) => {
    const qty = quantities[option.id] || option.min_qty
    addItem({
      id: `${campaign.id}-${option.id}`, campaign_id: campaign.id, campaign_slug: campaign.slug,
      campaign_title: campaign.title, campaign_category: campaign.category, campaign_image: campaign.image_url,
      donation_option_id: option.id, option_name: option.name, option_icon: option.icon, unit_price: option.price, quantity: qty, min_qty: option.min_qty,
    })
    toast.success(`${option.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-400 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-navy-700 whitespace-nowrap">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/campaigns" className="hover:text-navy-700 whitespace-nowrap">Campaigns</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-navy-700 font-medium truncate">{campaign.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-[16/7] rounded-3xl overflow-hidden">
              <Image src={campaign.image_url} alt={campaign.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-semibold" style={{ color: meta.color }}>
                <span>{meta.icon}</span>{meta.label}
              </div>
            </motion.div>

            <div className="bg-white rounded-2xl p-7 shadow-card border border-slate-100">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-900 mb-4 leading-tight">{campaign.title}</h1>

              <div className="mb-6">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: meta.color }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-navy-800">{formatCurrency(campaign.raised_amount)} raised</span>
                  <span className="text-slate-400">of {formatCurrency(campaign.goal_amount)} goal · {percent}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-7">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 text-navy-500 mx-auto mb-1.5" />
                  <div className="font-bold text-navy-800 text-sm">{campaign.beneficiaries}+</div>
                  <div className="text-slate-400 text-xs mt-0.5">Beneficiaries</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <MapPin className="w-5 h-5 text-navy-500 mx-auto mb-1.5" />
                  <div className="font-bold text-navy-800 text-sm truncate">{campaign.location}</div>
                  <div className="text-slate-400 text-xs mt-0.5">Location</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Shield className="w-5 h-5 text-navy-500 mx-auto mb-1.5" />
                  <div className="font-bold text-navy-800 text-sm">100%</div>
                  <div className="text-slate-400 text-xs mt-0.5">Transparent</div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 whitespace-pre-line">{campaign.description}</div>
            </div>

            {campaign.gallery_images?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {campaign.gallery_images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image src={img} alt={`${campaign.title} photo ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24 bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="px-5 py-4" style={{ background: meta.color }}>
                <h2 className="font-display font-bold text-white flex items-center gap-2"><Heart className="w-4 h-4 fill-current" /> Choose Your Donation</h2>
              </div>
              <div className="p-4 space-y-3 max-h-[560px] overflow-y-auto">
                {options.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8">No donation options available right now.</p>
                ) : options.map(option => {
                  const qty = quantities[option.id] || option.min_qty
                  return (
                    <div key={option.id} className="border border-slate-100 rounded-xl p-4 hover:border-navy-200 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl flex-shrink-0">{option.icon}</span>
                          <div className="min-w-0">
                            <div className="font-semibold text-navy-800 text-sm truncate">{option.name}</div>
                            {option.description && <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">{option.description}</div>}
                          </div>
                        </div>
                        <div className="font-bold text-navy-700 text-sm flex-shrink-0">{formatCurrency(option.price)}</div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                          <button onClick={() => updateQty(option.id, -1, option)} disabled={qty <= option.min_qty} className="p-2 hover:bg-slate-50 disabled:opacity-30 transition-colors" aria-label="Decrease quantity"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="text-sm font-semibold text-navy-800 w-8 text-center">{qty}</span>
                          <button onClick={() => updateQty(option.id, 1, option)} disabled={qty >= option.max_qty} className="p-2 hover:bg-slate-50 disabled:opacity-30 transition-colors" aria-label="Increase quantity"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <button onClick={() => handleAddToCart(option)} className="flex-1 flex items-center justify-center gap-1.5 bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
                          <ShoppingCart className="w-3.5 h-3.5" /> Add · {formatCurrency(option.price * qty)}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                <Link href="/cart" className="btn-primary w-full py-3 text-sm">Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
