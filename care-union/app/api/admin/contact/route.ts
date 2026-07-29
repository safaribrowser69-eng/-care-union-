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
  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')
  const supabase = createAdminClient()
  let query = supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
  if (status === 'unread') query = query.eq('is_read', false)
  if (status === 'read') query = query.eq('is_read', true)
  const { data, error } = await query
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const body = await req.json()
    const supabase = createAdminClient()
    if (body.markAllRead) await supabase.from('contact_submissions').update({ is_read: true }).eq('is_read', false)
    else if (body.id) await supabase.from('contact_submissions').update({ is_read: true }).eq('id', body.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact PATCH error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
