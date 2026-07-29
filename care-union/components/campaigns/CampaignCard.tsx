'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Users } from 'lucide-react'
import { formatCurrency, progressPercent } from '@/lib/utils'
import { CATEGORY_META } from '@/types'
import type { Campaign } from '@/types'

export function CampaignCard({ campaign, index = 0 }: { campaign: Campaign; index?: number }) {
  const meta = CATEGORY_META[campaign.category]
  const percent = progressPercent(campaign.raised_amount, campaign.goal_amount)

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: index * 0.08, duration: 0.5 }}>
      <Link href={`/campaigns/${campaign.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-52 overflow-hidden">
          <Image src={campaign.image_url} alt={campaign.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold" style={{ color: meta.color }}>
            <span>{meta.icon}</span>{meta.label}
          </div>
          {campaign.is_featured && (
            <div className="absolute top-3 right-3 bg-gold-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Featured</div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-navy-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-navy-700 transition-colors">{campaign.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{campaign.short_desc}</p>
          <div className="mb-3">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: meta.color }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-navy-800">{formatCurrency(campaign.raised_amount)}</span>
              <span className="text-slate-400">of {formatCurrency(campaign.goal_amount)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{campaign.beneficiaries}+ helped</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{campaign.location}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
