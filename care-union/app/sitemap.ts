import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://careunion.in'
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/campaigns`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/transparency`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('campaigns').select('slug, updated_at').eq('is_active', true)
    const campaignPages: MetadataRoute.Sitemap = (data || []).map(c => ({
      url: `${base}/campaigns/${c.slug}`, lastModified: new Date(c.updated_at), changeFrequency: 'weekly' as const, priority: 0.85,
    }))
    return [...staticPages, ...campaignPages]
  } catch { return staticPages }
}
