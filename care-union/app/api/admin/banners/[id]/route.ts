import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

function verifyAdmin(req: NextRequest): boolean {
  try {
    const cookie = req.cookies.get('cu_admin_session')
    if (!cookie) return false
    const session = JSON.parse(cookie.value)
    return session?.isAdmin === true && !!session?.id
  } catch { return false }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('homepage_banners').update(body).eq('id', id).select().single()
    if (error) throw error
    revalidatePath('/')
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Banner PUT error:', err)
    return NextResponse.json({ success: false, message: 'Failed to update banner.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const { error } = await supabase.from('homepage_banners').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Banner DELETE error:', err)
    return NextResponse.json({ success: false, message: 'Failed to delete banner.' }, { status: 500 })
  }
}
