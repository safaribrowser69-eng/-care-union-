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
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '50')
  const offset = (page - 1) * pageSize
  try {
    const supabase = createAdminClient()
    let query = supabase.from('orders').select('*, order_items(*)', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + pageSize - 1)
    if (status) query = query.eq('status', status)
    if (search) query = query.or(`donor_name.ilike.%${search}%,donor_email.ilike.%${search}%,receipt_number.ilike.%${search}%`)
    const { data, error, count } = await query
    if (error) throw error
    return NextResponse.json({ success: true, data, total: count, page, pageSize })
  } catch (err) {
    console.error('Admin donations GET error:', err)
    return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 500 })
  }
}
