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

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('transparency_reports').select('*, fund_allocations(*)').order('year', { ascending: false }).order('month', { ascending: false })
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const body = await req.json()
    const { fund_allocations, ...reportData } = body
    if (!reportData.title) return NextResponse.json({ success: false, message: 'Title required.' }, { status: 400 })
    const supabase = createAdminClient()
    const { data: report, error: reportError } = await supabase.from('transparency_reports').insert(reportData).select().single()
    if (reportError) throw reportError
    if (Array.isArray(fund_allocations)) {
      const valid = fund_allocations.filter((a: { category?: string }) => a.category?.trim())
      if (valid.length > 0) await supabase.from('fund_allocations').insert(valid.map((a: Record<string, unknown>) => ({ ...a, report_id: report.id })))
    }
    revalidatePath('/transparency')
    return NextResponse.json({ success: true, data: report }, { status: 201 })
  } catch (err) {
    console.error('Transparency POST error:', err)
    return NextResponse.json({ success: false, message: 'Failed to create report.' }, { status: 500 })
  }
}
