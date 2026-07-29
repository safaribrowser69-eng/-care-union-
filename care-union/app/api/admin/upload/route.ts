import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function verifyAdmin(req: NextRequest): boolean {
  try {
    const cookie = req.cookies.get('cu_admin_session')
    if (!cookie) return false
    const session = JSON.parse(cookie.value)
    return session?.isAdmin === true && !!session?.id
  } catch { return false }
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'
    if (!file) return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 })
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ success: false, message: 'Only JPG, PNG, WebP, or GIF allowed.' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ success: false, message: 'File must be under 5MB.' }, { status: 400 })
    const supabase = createAdminClient()
    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = await file.arrayBuffer()
    const { data, error } = await supabase.storage.from('care-union-media').upload(filename, buffer, { contentType: file.type, cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data: publicUrl } = supabase.storage.from('care-union-media').getPublicUrl(data.path)
    return NextResponse.json({ success: true, url: publicUrl.publicUrl, path: data.path })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ success: false, message: 'Upload failed.' }, { status: 500 })
  }
}
