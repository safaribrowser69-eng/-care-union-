import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { email, token, isAdmin } = await req.json()
    if (!email || !token) return NextResponse.json({ success: false, message: 'Email and OTP are required.' }, { status: 400 })
    const supabase = createAdminClient()
    const { data: otpRecord, error } = await supabase.from('otp_tokens').select('*').eq('email', email.trim().toLowerCase()).eq('token', token).eq('used', false).gt('expires_at', new Date().toISOString()).single()
    if (error || !otpRecord) return NextResponse.json({ success: false, message: 'Invalid or expired OTP.' }, { status: 401 })
    await supabase.from('otp_tokens').update({ used: true }).eq('id', otpRecord.id)

    if (isAdmin || otpRecord.is_admin) {
      const { data: admin } = await supabase.from('admins').select('id, email, name').eq('email', email.trim().toLowerCase()).single()
      if (!admin) return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 403 })
      const response = NextResponse.json({ success: true, isAdmin: true, user: { id: admin.id, email: admin.email, name: admin.name } })
      response.cookies.set('cu_admin_session', JSON.stringify({ id: admin.id, email: admin.email, isAdmin: true }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60*60*24*7, path: '/' })
      return response
    }
    const { data: user, error: userError } = await supabase.from('users').upsert({ email: email.trim().toLowerCase() }, { onConflict: 'email' }).select().single()
    if (userError) throw userError
    const response = NextResponse.json({ success: true, isAdmin: false, user })
    response.cookies.set('cu_user_session', JSON.stringify({ id: user.id, email: user.email }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60*60*24*30, path: '/' })
    return response
  } catch (err) {
    console.error('Verify OTP error:', err)
    return NextResponse.json({ success: false, message: 'Verification failed.' }, { status: 500 })
  }
}
