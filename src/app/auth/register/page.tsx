'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { CheckSquare, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { RegisterForm } from '@/types';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isRegisterLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: RegisterForm) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <CheckSquare className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-secondary-900">Task Manager</span>
          </Link>
          <h2 className="text-3xl font-bold text-secondary-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Únete a Task Manager</CardTitle>
            <CardDescription>
              Crea tu cuenta para comenzar a gestionar tus tareas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Nombre completo"
                type="text"
                placeholder="Tu nombre completo"
                leftIcon={<User className="h-5 w-5" />}
                error={errors.name?.message}
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'El nombre no puede exceder 50 caracteres',
                  },
                  pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                    message: 'El nombre solo puede contener letras y espacios',
                  },
                })}
              />

              <Input
                label="Email"
                type="email"
                placeholder="tu@ejemplo.com"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un email válido',
                  },
                })}
              />

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                helperText="Debe contener al menos una mayúscula, una minúscula y un número"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Debe contener al menos una mayúscula, una minúscula y un número',
                  },
                })}
              />

              <Input
                label="Confirmar contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (value) =>
                    value === password || 'Las contraseñas no coinciden',
                })}
              />

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-secondary-700">
                  Acepto los{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    política de privacidad
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isRegisterLoading}
                disabled={isRegisterLoading}
              >
                Crear cuenta
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-success-50 border-success-200">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-success-800 mb-2">
              ¿Por qué elegir Task Manager?
            </h3>
            <ul className="text-xs text-success-700 space-y-1">
              <li>• Gestión completa de tareas con estados y prioridades</li>
              <li>• Estadísticas detalladas de productividad</li>
              <li>• Interfaz moderna y fácil de usar</li>
              <li>• Seguridad avanzada con autenticación JWT</li>
              <li>• Completamente gratuito</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
