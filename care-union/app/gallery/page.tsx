import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase-server'
import { GalleryClient } from './GalleryClient'
import type { Gallery } from '@/types'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'See photos from Care Union Foundation drives — hunger relief, birthday celebrations, animal welfare, tree plantations, and women health camps across India.',
}

export const revalidate = 300

async function getGallery(): Promise<Gallery[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('gallery').select('*').eq('is_active', true).order('sort_order').order('created_at', { ascending: false })
    return (data || []) as Gallery[]
  } catch { return [] }
}

export default async function GalleryPage() {
  const items = await getGallery()
  return <GalleryClient items={items} />
}
