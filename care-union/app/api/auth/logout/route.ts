import { NextResponse } from 'next/server'
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('cu_user_session')
  response.cookies.delete('cu_admin_session')
  return response
}
