// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';  // 👈 Para sesiones globales

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Mi App PWA',
  description: 'Aplicación PWA con Next.js, Turso y Drizzle',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mi App',
  },
  icons: {
    apple: '/icons/icon-152.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener sesión en el servidor (opcional)
  const session = await auth();

  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-152.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}