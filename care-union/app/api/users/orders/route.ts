import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const userCookie = req.cookies.get('cu_user_session')
    const adminCookie = req.cookies.get('cu_admin_session')
    let email: string | null = null
    if (userCookie) { const s = JSON.parse(userCookie.value); email = s?.email || null }
    else if (adminCookie) { const s = JSON.parse(adminCookie.value); email = s?.email || null }
    if (!email) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('donor_email', email).order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ success: true, data: data || [] })
  } catch (err) {
    console.error('User orders GET error:', err)
    return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 500 })
  }
}
