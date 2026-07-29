import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase-server'
import { CampaignsClient } from './CampaignsClient'
import type { Campaign } from '@/types'

export const metadata: Metadata = {
  title: 'All Campaigns',
  description: 'Browse all Care Union Foundation campaigns — hunger relief, birthday blessings, animal welfare, tree plantation, and women health drives across India.',
}

export const revalidate = 300

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('campaigns').select('*').eq('is_active', true).order('sort_order')
    return (data || []) as Campaign[]
  } catch { return [] }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()
  return <CampaignsClient campaigns={campaigns} />
}
