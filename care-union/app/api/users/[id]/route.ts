import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

function getSessionInfo(req: NextRequest): { userId: string | null; isAdmin: boolean } {
  try {
    const adminCookie = req.cookies.get('cu_admin_session')
    if (adminCookie) { const s = JSON.parse(adminCookie.value); if (s?.isAdmin) return { userId: s.id, isAdmin: true } }
    const userCookie = req.cookies.get('cu_user_session')
    if (userCookie) { const s = JSON.parse(userCookie.value); return { userId: s.id || null, isAdmin: false } }
  } catch { /* ignore */ }
  return { userId: null, isAdmin: false }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, isAdmin } = getSessionInfo(req)
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
  const { id } = await params
  if (!isAdmin && userId !== id) return NextResponse.json({ success: false, message: 'Forbidden.' }, { status: 403 })
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('users').select('id, email, name, phone, city, state, pincode, created_at').eq('id', id).single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('User GET error:', err)
    return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, isAdmin } = getSessionInfo(req)
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
  const { id } = await params
  if (!isAdmin && userId !== id) return NextResponse.json({ success: false, message: 'Forbidden.' }, { status: 403 })
  try {
    const body = await req.json()
    const allowed = ['name', 'phone', 'city', 'state', 'pincode']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) if (body[key] !== undefined) updates[key] = body[key]
    if (Object.keys(updates).length === 0) return NextResponse.json({ success: false, message: 'No valid fields to update.' }, { status: 400 })
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select('id, email, name, phone, city, state, pincode').single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('User PATCH error:', err)
    return NextResponse.json({ success: false, message: 'Failed to update profile.' }, { status: 500 })
  }
}
