import { createAdminClient } from '@/lib/supabase-server'
import { HeroSection } from '@/components/home/HeroSection'
import { DonorTicker } from '@/components/home/DonorTicker'
import { StatsCounter } from '@/components/home/StatsCounter'
import { CampaignGrid } from '@/components/home/CampaignGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Testimonials } from '@/components/home/Testimonials'
import { ImpactBanner } from '@/components/home/ImpactBanner'
import type { Campaign, HomepageBanner } from '@/types'

export const revalidate = 300

async function getHomeData() {
  try {
    const supabase = createAdminClient()
    const [{ data: banners }, { data: campaigns }] = await Promise.all([
      supabase.from('homepage_banners').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('campaigns').select('*').eq('is_active', true).order('sort_order').limit(6),
    ])
    return { banners: (banners || []) as HomepageBanner[], campaigns: (campaigns || []) as Campaign[] }
  } catch {
    return { banners: [], campaigns: [] }
  }
}

export default async function HomePage() {
  const { banners, campaigns } = await getHomeData()
  return (
    <>
      <HeroSection banners={banners} />
      <DonorTicker />
      <StatsCounter />
      <CampaignGrid campaigns={campaigns} />
      <HowItWorks />
      <Testimonials />
      <ImpactBanner />
    </>
  )
}
