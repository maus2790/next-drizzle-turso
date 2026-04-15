// app/dashboard/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { handleLogout, getCurrentUser } from '@/app/actions/auth';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; provider?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                router.push('/login');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        }
        loadUser();
    }, [router]);

    const handleLogoutClick = async () => {
        await handleLogout();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="glass rounded-3xl p-8 shadow-xl shadow-accent/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-foreground mb-2">
                                ¡Bienvenido de nuevo!
                            </h2>
                            <p className="text-gray-400 font-medium">
                                Has iniciado sesión como <span className="text-accent underline decoration-dotted transition-all">{user?.name}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 bg-accent/10 rounded-xl flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                    En Línea
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-accent/40 transition-colors">
                            <h3 className="font-bold text-lg mb-2">Información de la Cuenta</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Proveedor:</span>
                                    <span className="text-xs font-bold uppercase">{user?.provider || 'Email'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400">Sesión válida por:</span>
                                    <span className="text-xs font-bold">7 días</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-background/50 border border-border/50 flex flex-col justify-center items-center text-center">
                            <p className="text-sm text-gray-400 mb-4 italic">
                                "Esta es un área protegida. Solo usuarios logueados pueden verla."
                            </p>
                            {user?.provider === 'google' && (
                                <div className="w-full p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <p className="text-xs text-blue-500 font-bold">
                                        ✅ Verificado con Google
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}