import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { sendOtpEmail } from '@/lib/email'
import { generateOTP } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { email, isAdmin } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 })
    const supabase = createAdminClient()
    if (isAdmin) {
      const { data: admin } = await supabase.from('admins').select('id').eq('email', email.trim().toLowerCase()).single()
      if (!admin) return NextResponse.json({ success: false, message: 'Admin access not authorised for this email.' }, { status: 403 })
    }
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await supabase.from('otp_tokens').delete().eq('email', email.trim().toLowerCase())
    const { error } = await supabase.from('otp_tokens').insert({ email: email.trim().toLowerCase(), token: otp, is_admin: isAdmin || false, expires_at: expiresAt.toISOString() })
    if (error) throw error
    await sendOtpEmail(email.trim(), otp, isAdmin)
    return NextResponse.json({ success: true, message: 'OTP sent successfully.' })
  } catch (err) {
    console.error('Send OTP error:', err)
    return NextResponse.json({ success: false, message: 'Failed to send OTP.' }, { status: 500 })
  }
}
