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
    const { fund_allocations, ...reportData } = body
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('transparency_reports').update(reportData).eq('id', id).select().single()
    if (error) throw error
    if (Array.isArray(fund_allocations)) {
      await supabase.from('fund_allocations').delete().eq('report_id', id)
      const valid = fund_allocations.filter((a: { category?: string }) => a.category?.trim())
      if (valid.length > 0) await supabase.from('fund_allocations').insert(valid.map((a: Record<string, unknown>) => ({ ...a, report_id: id })))
    }
    revalidatePath('/transparency')
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Transparency PUT error:', err)
    return NextResponse.json({ success: false, message: 'Failed to update report.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const { error } = await supabase.from('transparency_reports').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/transparency')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Transparency DELETE error:', err)
    return NextResponse.json({ success: false, message: 'Failed to delete report.' }, { status: 500 })
  }
}
