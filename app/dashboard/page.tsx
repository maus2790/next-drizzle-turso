'use client';

import { useRouter } from 'next/navigation';
import { handleLogout, getCurrentUser } from '@/app/actions/auth';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar información del usuario
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
        await handleLogout();  // Esto hace redirect a /login
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Barra de navegación */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Mi App</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                                Hola, {user?.name || 'Usuario'}
                            </span>
                            <button
                                onClick={handleLogoutClick}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        ¡Bienvenido al Dashboard!
                    </h2>
                    <p className="text-gray-600">
                        Esta es un área protegida. Solo usuarios logueados pueden verla.
                    </p>
                    <p className="text-gray-600 mt-2">
                        Tu sesión es válida por 7 días.
                    </p>
                </div>
            </div>
        </div>
    );
}