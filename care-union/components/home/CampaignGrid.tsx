import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { SectionHeader } from '@/components/ui/Badge'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Campaign } from '@/types'

export function CampaignGrid({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <section className="bg-slate-50 py-20 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Our Campaigns" title="Choose a Cause Close to Your Heart" subtitle="From feeding the hungry to planting trees, every campaign is 100% transparent — track exactly how your donation makes an impact." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {campaigns.map((c, i) => (<CampaignCard key={c.id} campaign={c} index={i} />))}
        </div>
        <div className="text-center">
          <Link href="/campaigns" className="inline-flex items-center gap-2 text-navy-700 font-semibold hover:text-navy-900 transition-colors">
            View All Campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
