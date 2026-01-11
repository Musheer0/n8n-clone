import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;

    // Public routes that don't need authentication
    const publicRoutes = ['/',  '/api/auth','/login','/api/'];
    const isPublicRoute = publicRoutes.some(route => 
        request.nextUrl.pathname.startsWith(route)
    );

    // If no session token and trying to access protected route
    if (!sessionToken && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If has session token and trying to access auth pages, redirect to dashboard
    if (sessionToken && (request.nextUrl.pathname === '/login' )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};