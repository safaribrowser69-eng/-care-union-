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
  const { data, error } = await supabase.from('faqs').select('*').order('sort_order').order('created_at')
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.question?.trim() || !body.answer?.trim()) return NextResponse.json({ success: false, message: 'Question and answer required.' }, { status: 400 })
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('faqs').insert(body).select().single()
    if (error) throw error
    revalidatePath('/faq')
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('FAQ POST error:', err)
    return NextResponse.json({ success: false, message: 'Failed to create FAQ.' }, { status: 500 })
  }
}
