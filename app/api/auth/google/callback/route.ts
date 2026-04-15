// app/api/auth/google/callback/route.ts
// Maneja el callback de Google OAuth manualmente.
// Intercambia el código por un access_token, llama /userinfo de Google
// (sin validar JWT — evita el problema del reloj), y crea la sesión.

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    // Si Google devolvió un error (ej: usuario canceló)
    if (errorParam) {
        return NextResponse.redirect(new URL('/login?error=cancelled', request.url));
    }

    if (!code || !state) {
        return NextResponse.redirect(new URL('/login?error=missing_params', request.url));
    }

    // Verificar el state para prevenir CSRF
    const cookieStore = await cookies();
    const savedState = cookieStore.get('google_oauth_state')?.value;

    if (!savedState) {
        // Cookie de state no recibida — puede pasar si el browser bloquea cookies
        // de terceros o si hubo un reload antes del callback.
        console.warn('[Google OAuth] Cookie de state no encontrada. Posible problema de cookies o doble intento.');
        return NextResponse.redirect(new URL('/login?error=state_cookie_missing', request.url));
    }

    if (savedState !== state) {
        console.warn('[Google OAuth] State no coincide. Posible ataque CSRF.');
        return NextResponse.redirect(new URL('/login?error=invalid_state', request.url));
    }

    // Limpiar la cookie de state
    cookieStore.set('google_oauth_state', '', { maxAge: 0, path: '/' });

    try {
        const clientId = process.env.AUTH_GOOGLE_ID!;
        const clientSecret = process.env.AUTH_GOOGLE_SECRET!;
        const { origin } = new URL(request.url);
        const redirectUri = `${origin}/api/auth/google/callback`;

        // ==============================================================
        // PASO 1: Intercambiar el código por un access_token
        // Usamos fetch directo — NO validamos el id_token (evita error de reloj)
        // ==============================================================
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const err = await tokenResponse.text();
            console.error('[Google OAuth] Error al obtener token:', err);
            return NextResponse.redirect(new URL('/login?error=token_exchange', request.url));
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error('[Google OAuth] No se recibió access_token');
            return NextResponse.redirect(new URL('/login?error=no_token', request.url));
        }

        // ==============================================================
        // PASO 2: Obtener el perfil del usuario usando el access_token
        // Este endpoint NO requiere validar JWT — solo un Bearer token
        // ==============================================================
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userInfoResponse.ok) {
            console.error('[Google OAuth] Error al obtener userinfo');
            return NextResponse.redirect(new URL('/login?error=userinfo_failed', request.url));
        }

        const googleUser = await userInfoResponse.json();
        const { sub: providerId, email, name, picture } = googleUser;

        if (!email) {
            return NextResponse.redirect(new URL('/login?error=no_email', request.url));
        }

        // ==============================================================
        // PASO 3: Crear o encontrar el usuario en nuestra base de datos
        // ==============================================================
        let existingUsers = await db.select().from(users).where(eq(users.email, email));

        if (existingUsers.length === 0) {
            // Usuario nuevo — crear registro
            await db.insert(users).values({
                email,
                name: name || 'Usuario Google',
                provider: 'google',
                providerId,
                createdAt: new Date(),
            });
            existingUsers = await db.select().from(users).where(eq(users.email, email));
        } else if (!existingUsers[0].provider) {
            // Usuario con email/password que ahora usa Google — vincular cuenta
            await db.update(users)
                .set({ provider: 'google', providerId })
                .where(eq(users.email, email));
        }

        const user = existingUsers[0];

        // ==============================================================
        // PASO 4: Crear la sesión con cookies (igual que el login normal)
        // ==============================================================
        const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

        cookieStore.set('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 días
            path: '/',
        });

        cookieStore.set('user_id', user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        cookieStore.set('user_name', user.name, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        // ==============================================================
        // PASO 5: Redirigir al dashboard
        // ==============================================================
        return NextResponse.redirect(new URL('/dashboard', request.url));

    } catch (error) {
        console.error('[Google OAuth] Error inesperado:', error);
        return NextResponse.redirect(new URL('/login?error=server_error', request.url));
    }
}
