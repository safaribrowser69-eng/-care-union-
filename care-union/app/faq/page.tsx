import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase-server'
import { FaqClient } from './FaqClient'
import type { Faq } from '@/types'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about donating, payments, transparency, volunteering, and more at Care Union Foundation.',
}

export const revalidate = 300

async function getFaqs(): Promise<Faq[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('faqs').select('*').eq('is_active', true).order('sort_order').order('created_at')
    return (data || []) as Faq[]
  } catch { return [] }
}

export default async function FaqPage() {
  const faqs = await getFaqs()
  return <FaqClient faqs={faqs} />
}
