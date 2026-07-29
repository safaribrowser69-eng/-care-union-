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
    if (body.slug) {
      const { data: existing } = await supabase.from('campaigns').select('id').eq('slug', body.slug).neq('id', id).single()
      if (existing) return NextResponse.json({ success: false, message: 'Slug already in use.' }, { status: 409 })
    }
    const { data, error } = await supabase.from('campaigns').update(body).eq('id', id).select().single()
    if (error) throw error
    revalidatePath('/campaigns'); revalidatePath(`/campaigns/${data.slug}`); revalidatePath('/')
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Campaign PUT error:', err)
    return NextResponse.json({ success: false, message: 'Failed to update campaign.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const { data: campaign } = await supabase.from('campaigns').select('slug').eq('id', id).single()
    const { error } = await supabase.from('campaigns').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/campaigns'); if (campaign?.slug) revalidatePath(`/campaigns/${campaign.slug}`); revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Campaign DELETE error:', err)
    return NextResponse.json({ success: false, message: 'Failed to delete campaign.' }, { status: 500 })
  }
}
