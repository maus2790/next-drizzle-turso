// app/login/page.tsx

'use client';

import { handleLogin } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError('');

        const result = await handleLogin(formData);

        if (result && 'error' in result && result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoogle = () => {
        setGoogleLoading(true);
        // Navegar directo al endpoint de OAuth — no usar server action aquí
        window.location.href = '/api/auth/google';
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass rounded-3xl shadow-2xl p-8 border border-border/50">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Bienvenido</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Inicia sesión en tu cuenta</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                        {error}
                    </div>
                )}

                {/* Formulario de email/password */}
                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-foreground text-sm font-bold mb-2 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                            placeholder="usuario@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-foreground text-sm font-bold mb-2 ml-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-accent/20"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Separador */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                        <span className="px-4 bg-background text-muted-foreground">O continúa con</span>
                    </div>
                </div>

                {/* Botón de Google */}
                <button
                    onClick={handleGoogle}
                    disabled={googleLoading}
                    className="w-full bg-background border border-border text-foreground font-bold py-3 px-4 rounded-xl hover:bg-accent/5 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3 shadow-md"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span className="text-sm">
                        {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
                    </span>
                </button>

                <p className="text-center text-muted-foreground mt-8 text-sm font-medium">
                    ¿No tienes cuenta?{' '}
                    <a href="/register" className="text-accent hover:underline font-bold transition-all">
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </div>

    );
}