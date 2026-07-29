import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { sendContactAckEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json()
    if (!name || !email || !subject || !message) return NextResponse.json({ success: false, message: 'All required fields must be filled.' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 })
    const supabase = createAdminClient()
    const { error } = await supabase.from('contact_submissions').insert({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || null, subject: subject.trim(), message: message.trim() })
    if (error) throw error
    try { await sendContactAckEmail(name.trim(), email.trim(), subject.trim()) } catch (e) { console.error('Ack email failed (non-fatal):', e) }
    return NextResponse.json({ success: true, message: 'Message received. We will reply within 24 hours.' })
  } catch (err) {
    console.error('Contact submit error:', err)
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 })
  }
}
