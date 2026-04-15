// app/api/auth/google/route.ts
// Este endpoint inicia el flujo OAuth de Google manualmente,
// sin depender de Auth.js (que falla por el reloj del servidor).

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const clientId = process.env.AUTH_GOOGLE_ID!;
    const redirectUri = `${process.env.AUTH_URL}/api/auth/google/callback`;

    // Generar un 'state' aleatorio para prevenir ataques CSRF
    const state = Math.random().toString(36).substring(2, 15);

    // Guardar el state en una cookie para verificarlo en el callback
    const cookieStore = await cookies();
    cookieStore.set('google_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10 minutos
        path: '/',
    });

    // Construir la URL de autorización de Google
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state: state,
        access_type: 'online',
        // Sin 'prompt' → Google recuerda al usuario y omite la pantalla
        // de consentimiento en intentos posteriores.
        // Solo aparece la primera vez (comportamiento estándar de OAuth).
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.redirect(googleAuthUrl);
}
