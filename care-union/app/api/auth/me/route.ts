import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const adminCookie = req.cookies.get('cu_admin_session')
    if (adminCookie) {
      const session = JSON.parse(adminCookie.value)
      if (session?.isAdmin && session?.id) {
        const supabase = createAdminClient()
        const { data } = await supabase.from('admins').select('id, email, name').eq('id', session.id).single()
        if (data) return NextResponse.json({ user: { id: data.id, email: data.email, name: data.name }, isAdmin: true })
      }
    }
    const userCookie = req.cookies.get('cu_user_session')
    if (userCookie) {
      const session = JSON.parse(userCookie.value)
      if (session?.id) {
        const supabase = createAdminClient()
        const { data } = await supabase.from('users').select('id, email, name, phone, pan_number, city, state, pincode, created_at, updated_at').eq('id', session.id).single()
        if (data) return NextResponse.json({ user: data, isAdmin: false })
      }
    }
    return NextResponse.json({ user: null, isAdmin: false })
  } catch { return NextResponse.json({ user: null, isAdmin: false }) }
}
