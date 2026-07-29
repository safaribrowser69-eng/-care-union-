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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const supabase = createAdminClient()
    const { error } = await supabase.from('contact_submissions').update({ is_read: body.is_read ?? true, replied_at: body.replied_at ?? null }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact PATCH [id] error:', err)
    return NextResponse.json({ success: false, message: 'Failed to update.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact DELETE error:', err)
    return NextResponse.json({ success: false, message: 'Failed to delete.' }, { status: 500 })
  }
}
