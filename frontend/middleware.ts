import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminPublicPaths = ['/admin/login']
const customerPublicPaths = ['/customer/login', '/customer/register', '/customer/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !adminPublicPaths.includes(pathname)) {
    const token = request.cookies.get('msc_admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (pathname.startsWith('/customer') && !customerPublicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const token = request.cookies.get('msc_customer_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/customer/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*'],
}
