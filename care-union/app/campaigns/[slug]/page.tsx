import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-server'
import { CampaignDetailClient } from './CampaignDetailClient'
import type { Campaign } from '@/types'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('campaigns').select('slug').eq('is_active', true)
    return (data || []).map(c => ({ slug: c.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('campaigns').select('title, short_desc, image_url, meta_title, meta_description').eq('slug', slug).single()
    if (!data) return { title: 'Campaign Not Found' }
    return {
      title: data.meta_title || `${data.title} | Care Union Foundation`,
      description: data.meta_description || data.short_desc,
      openGraph: { title: data.meta_title || data.title, description: data.short_desc, images: [{ url: data.image_url }] },
    }
  } catch { return { title: 'Campaign | Care Union Foundation' } }
}

export const revalidate = 300

async function getCampaign(slug: string): Promise<Campaign | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('campaigns').select('*, donation_options(*)').eq('slug', slug).eq('is_active', true).single()
    return data as Campaign | null
  } catch { return null }
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params
  const campaign = await getCampaign(slug)
  if (!campaign) notFound()
  return <CampaignDetailClient campaign={campaign} />
}
