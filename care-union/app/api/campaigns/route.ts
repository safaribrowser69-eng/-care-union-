import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
export const revalidate = 300

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const slug = searchParams.get('slug')
  const limit = parseInt(searchParams.get('limit') || '20')
  try {
    const supabase = createAdminClient()
    let query = supabase.from('campaigns').select('*, donation_options(*)').eq('is_active', true).order('sort_order').limit(Math.min(limit, 50))
    if (category) query = query.eq('category', category)
    if (featured === '1') query = query.eq('is_featured', true)
    if (slug) query = query.eq('slug', slug)
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ success: true, data: data || [] }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
  } catch (err) {
    console.error('Public campaigns GET error:', err)
    return NextResponse.json({ success: false, message: 'Failed to fetch campaigns.' }, { status: 500 })
  }
}
