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
  const { data, error } = await supabase.from('homepage_banners').select('*').order('sort_order')
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.title || !body.image_url) return NextResponse.json({ success: false, message: 'Title and image required.' }, { status: 400 })
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('homepage_banners').insert(body).select().single()
    if (error) throw error
    revalidatePath('/')
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('Banners POST error:', err)
    return NextResponse.json({ success: false, message: 'Failed to create banner.' }, { status: 500 })
  }
}
