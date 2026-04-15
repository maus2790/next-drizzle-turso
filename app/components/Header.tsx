'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import { UserMenu } from './UserMenu';
import Link from 'next/link';

export function Header({ session }: { session?: any }) {
  const [user, setUser] = useState<any>(session?.user || null);
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      async function loadUser() {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
      loadUser();
    }
  }, [user]);

  // Cabecera oculta en login/registro y solo visible si hay usuario
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage || !user) return null;

  return (
    <header className="sticky top-0 z-40 w-full glass shadow-sm border-b border-border/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-black group-hover:rotate-12 transition-transform shadow-lg">
              M
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-accent to-blue-400 bg-clip-text text-transparent">
              Mi App
            </span>
          </Link>

          {/* User Info & Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-[10px] text-gray-400">Usuario Activo</p>
                </div>
                <UserMenu user={user} />
              </>
            ) : (
              <Link 
                href="/login"
                className="text-sm font-medium px-4 py-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
