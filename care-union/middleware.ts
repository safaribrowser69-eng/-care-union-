import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('cu_admin_session')
    if (!adminSession) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      url.searchParams.set('role', 'admin')
      return NextResponse.redirect(url)
    }
    try {
      const s = JSON.parse(adminSession.value)
      if (!s.isAdmin) return NextResponse.redirect(new URL('/login', request.url))
    } catch {
      const r = NextResponse.redirect(new URL('/login', request.url))
      r.cookies.delete('cu_admin_session')
      return r
    }
  }

  if (pathname.startsWith('/dashboard')) {
    const user  = request.cookies.get('cu_user_session')
    const admin = request.cookies.get('cu_admin_session')
    if (!user && !admin) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher:['/admin/:path*','/dashboard/:path*'],
}
