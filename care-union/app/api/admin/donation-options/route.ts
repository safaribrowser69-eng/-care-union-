import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

function verifyAdmin(req: NextRequest): boolean {
  try {
    const cookie = req.cookies.get('cu_admin_session')
    if (!cookie) return false
    const session = JSON.parse(cookie.value)
    return session?.isAdmin === true && !!session?.id
  } catch { return false }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  const campaignId = req.nextUrl.searchParams.get('campaign_id')
  const supabase = createAdminClient()
  let query = supabase.from('donation_options').select('*').order('sort_order')
  if (campaignId) query = query.eq('campaign_id', campaignId)
  const { data, error } = await query
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.campaign_id || !body.name || !body.price) return NextResponse.json({ success: false, message: 'campaign_id, name and price required.' }, { status: 400 })
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('donation_options').insert(body).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('Donation option POST error:', err)
    return NextResponse.json({ success: false, message: 'Failed to create option.' }, { status: 500 })
  }
}
