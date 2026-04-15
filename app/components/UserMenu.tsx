'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
  User,
  Settings,
  LayoutDashboard,
  Sun,
  Moon,
  Maximize,
  Minimize,
  LogOut,
  UserCircle
} from 'lucide-react';
import { handleLogout } from '@/app/actions/auth';
import Link from 'next/link';

interface UserMenuProps {
  user: {
    name: string;
    email?: string;
    image?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors cursor-pointer focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-md">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 glass shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-accent-foreground text-xl font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-foreground truncate">{user.name}</span>
                  <span className="text-xs text-gray-400 truncate">Estudiante / Usuario</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle className="w-5 h-5 text-accent" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Mi Perfil</span>
                <span className="text-[10px] text-gray-400">Ver y editar perfil</span>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5 text-accent" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Dashboard</span>
                <span className="text-[10px] text-gray-400">Ir al panel principal</span>
              </div>
            </Link>

            <div className="h-px bg-border my-2 mx-2" />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-foreground"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
                <span className="text-[10px] text-gray-400">Cambiar apariencia</span>
              </div>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-foreground"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-teal-500" />
              ) : (
                <Maximize className="w-5 h-5 text-teal-500" />
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">Pantalla Completa</span>
                <span className="text-[10px] text-gray-400">{isFullscreen ? 'Salir' : 'Activar'} modo cine</span>
              </div>
            </button>

            <div className="h-px bg-border my-2 mx-2" />

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
