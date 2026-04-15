'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';  // 👈 NUEVO: Para manejar cookies
import { signIn, signOut, auth } from '@/auth';  // 👈 NUEVO

// Función para generar un ID de sesión simple
function generateSessionId() {
    return Date.now() + '-' + Math.random().toString(36).substring(2, 15);
}

export async function handleRegister(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
        return { error: 'Todos los campos son requeridos' };
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
        return { error: 'El email ya está registrado' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
        email: email,
        password: hashedPassword,
        name: name,
    });

    redirect('/login');
}

export async function handleLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Todos los campos son requeridos' };
    }

    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) {
        return { error: 'Credenciales inválidas' };
    }

    // Verificar que el usuario tiene contraseña (no es de Google)
    if (!user[0].password) {
        return { error: 'Esta cuenta usa Google. Inicia sesión con Google.' };
    }

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
        return { error: 'Credenciales inválidas' };
    }

    // ============================================================
    // 👇👇👇 LO NUEVO: Crear la cookie de sesión 👇👇👇
    // ============================================================

    const cookieStore = await cookies();

    // Crear un ID de sesión único
    const sessionId = generateSessionId();

    // Guardar en cookie (expira en 7 días)
    cookieStore.set('session_id', sessionId, {
        httpOnly: true,      // 🔒 No accesible desde JavaScript (seguro)
        secure: process.env.NODE_ENV === 'production',  // Solo HTTPS en producción
        sameSite: 'lax',     // Protege contra CSRF
        maxAge: 60 * 60 * 24 * 7,  // 7 días en segundos
        path: '/',           // Válida para toda la app
    });

    // Guardar también el ID del usuario (opcional, para no consultar DB siempre)
    cookieStore.set('user_id', user[0].id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    // Guardar nombre (solo para mostrar en UI, no es sensible)
    cookieStore.set('user_name', user[0].name, {
        httpOnly: false,     // Para que el cliente pueda leerlo
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    // Redirigir al dashboard
    redirect('/dashboard');
}

// ============================================================
// NUEVA: Login con Google
// ============================================================

export async function handleGoogleLogin() {
    // Redirigir al endpoint que inicia el flujo OAuth manualmente
    // (evitamos Auth.js que falla por el desfase de reloj del servidor)
    redirect('/api/auth/google')
}

// ============================================================
// NUEVA: Obtener usuario actual (unificado)
// ============================================================

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value
    const userName = cookieStore.get('user_name')?.value

    if (!userId) return null

    const user = await db.select().from(users).where(eq(users.id, parseInt(userId)))
    if (!user[0]) return null

    return {
        id: user[0].id,
        email: user[0].email,
        name: userName || user[0].name,
        provider: user[0].provider || 'email',
    }
}

// ============================================================
// NUEVA: Cerrar sesión unificado
// ============================================================

export async function handleLogout() {
    // Limpiar cookies manuales
    const cookieStore = await cookies()
    cookieStore.set('session_id', '', { maxAge: 0, path: '/' })
    cookieStore.set('user_id', '', { maxAge: 0, path: '/' })
    cookieStore.set('user_name', '', { maxAge: 0, path: '/' })

    // Cerrar sesión de NextAuth (Google)
    await signOut({ redirectTo: '/login' })
}