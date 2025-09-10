import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager - Gestión de Tareas',
  description: 'Aplicación moderna para gestión de tareas con autenticación JWT y roles de usuario',
  keywords: ['task manager', 'gestión de tareas', 'productividad', 'organización'],
  authors: [{ name: 'Tu Nombre' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Task Manager - Gestión de Tareas',
    description: 'Aplicación moderna para gestión de tareas con autenticación JWT y roles de usuario',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Manager - Gestión de Tareas',
    description: 'Aplicación moderna para gestión de tareas con autenticación JWT y roles de usuario',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-primary-50 via-white to-secondary-50`}>
        <QueryProvider>
          <div className="min-h-full">
            {children}
          </div>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
