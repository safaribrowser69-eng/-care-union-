import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '30'), 50)
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('donor_wall').select('id, name, amount, cause, city, is_anonymous, created_at').order('created_at', { ascending: false }).limit(limit)
    if (error) throw error
    return NextResponse.json({ success: true, data: data || [] }, { headers: { 'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40' } })
  } catch (err) {
    console.error('Donor wall GET error:', err)
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}
