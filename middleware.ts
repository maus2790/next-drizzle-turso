// middleware.ts (en la misma carpeta que package.json)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que NO requieren autenticación
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Obtener la cookie de sesión
    const sessionId = request.cookies.get('session_id')?.value;
    const isLoggedIn = !!sessionId;  // true si existe la cookie

    // Si está en ruta pública y NO está logueado → dejar pasar
    if (publicRoutes.includes(pathname) && !isLoggedIn) {
        return NextResponse.next();
    }

    // Si está en ruta pública pero SÍ está logueado → redirigir a dashboard
    if (publicRoutes.includes(pathname) && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si NO está en ruta pública y NO está logueado → redirigir a login
    if (!publicRoutes.includes(pathname) && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si está autenticado y quiere acceder a ruta protegida → dejar pasar
    return NextResponse.next();
}

// Configurar qué rutas debe revisar el middleware
export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas EXCEPTO:
         * - api (API routes)
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (favicon)
         * - public (carpeta pública)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|manifest\\.json|icons/.*).*)',
    ],
};