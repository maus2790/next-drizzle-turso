import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mi App PWA',
  description: 'Aplicación profesional con sistema de autenticación',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mi App PWA',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        {/* Windows Tile */}
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
        <meta name="msapplication-TileColor" content="#3B82F6" />

        {/* Chrome/Firefox theme */}
        <meta name="theme-color" content="#3B82F6" />

        {/* Mobile Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mi App PWA" />

        {/* Facebook/Twitter */}
        <meta property="og:title" content="Mi App PWA" />
        <meta property="og:description" content="Aplicación profesional con sistema de autenticación" />
        <meta property="og:type" content="website" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}