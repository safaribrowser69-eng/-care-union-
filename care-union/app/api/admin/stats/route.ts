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

export async function GET() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('site_stats').select('*')
  return NextResponse.json({ success: true, stats: data || [] })
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const { stats } = await req.json() as { stats: Array<{ key: string; value: string; label?: string }> }
    if (!stats?.length) return NextResponse.json({ success: false, message: 'No stats provided.' }, { status: 400 })
    const supabase = createAdminClient()
    const { error } = await supabase.from('site_stats').upsert(stats.map(s => ({ key: s.key, value: s.value, label: s.label, updated_at: new Date().toISOString() })), { onConflict: 'key' })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Stats update error:', err)
    return NextResponse.json({ success: false, message: 'Failed to update stats.' }, { status: 500 })
  }
}
