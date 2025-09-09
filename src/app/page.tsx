'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { CheckSquare, Users, BarChart3, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-secondary-900">Task Manager</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/auth/login')}
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => router.push('/auth/register')}
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
            Gestiona tus tareas de forma
            <span className="text-primary-600"> inteligente</span>
          </h1>
          
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Una aplicación moderna y segura para organizar tus tareas, 
            colaborar con tu equipo y aumentar tu productividad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/auth/register')}
              className="text-lg px-8 py-4"
            >
              Comenzar Gratis
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/auth/login')}
              className="text-lg px-8 py-4"
            >
              Ya tengo cuenta
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Características principales
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tus tareas de manera eficiente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckSquare className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>
                  Crea, organiza y prioriza tus tareas con estados y fechas de vencimiento
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-success-600" />
                </div>
                <CardTitle>Roles de Usuario</CardTitle>
                <CardDescription>
                  Sistema de roles con permisos diferenciados para usuarios y administradores
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-warning-600" />
                </div>
                <CardTitle>Estadísticas</CardTitle>
                <CardDescription>
                  Visualiza tu progreso con estadísticas detalladas y métricas de productividad
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-error-600" />
                </div>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Autenticación JWT segura con refresh tokens y protección de datos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            ¿Listo para ser más productivo?
          </h2>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están organizando sus tareas de manera eficiente
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/auth/register')}
            className="text-lg px-8 py-4"
          >
            Crear cuenta gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 px-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CheckSquare className="h-6 w-6" />
              <span className="text-lg font-semibold">Task Manager</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-secondary-400">
                © 2024 Task Manager. Todos los derechos reservados.
              </p>
              <p className="text-sm text-secondary-500 mt-1">
                Desarrollado con ❤️ para aumentar tu productividad
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
