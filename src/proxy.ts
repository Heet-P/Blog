import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isLoginRoute = pathname === '/admin/login'
    const isAdminRoute = pathname.startsWith('/admin')

    // Helper to verify session cookie
    const verifySession = async () => {
        const sessionCookie = request.cookies.get('admin_session')?.value
        if (!sessionCookie) return false;

        try {
            const secretKey = process.env.ADMIN_SESSION_SECRET || ""
            if (secretKey) {
                await jwtVerify(sessionCookie, new TextEncoder().encode(secretKey))
                return true
            }
        } catch (err) {
            // Invalid token
        }
        return false;
    }

    // 1. Protect /admin routes
    if (isAdminRoute && !isLoginRoute) {
        const isValid = await verifySession();
        if (!isValid) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // 2. Protect state-changing API routes
    if (pathname.startsWith('/api') && request.method !== 'GET' && pathname !== '/api/admin/login') {
        const isValid = await verifySession();
        if (!isValid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
}
