'use client';

import { handleRegister } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError('');

        const result = await handleRegister(formData);

        // ✅ CORREGIDO: Verificar si existe error
        if (result && 'error' in result && result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Éxito - redirigir al login
            router.push('/login');
        }
    };

    return (
        // ✅ CORREGIDO: bg-linear-to-br en lugar de bg-gradient-to-br
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass rounded-3xl shadow-2xl p-8 border border-border/50">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Crear Cuenta</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Regístrate para comenzar</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-foreground text-sm font-bold mb-2 ml-1">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                            placeholder="Juan Pérez"
                        />
                    </div>

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
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <p className="text-center text-muted-foreground mt-8 text-sm font-medium">
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className="text-accent hover:underline font-bold transition-all">
                        Inicia sesión aquí
                    </a>
                </p>
            </div>
        </div>
    );
}