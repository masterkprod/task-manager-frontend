'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { ArrowLeft, Save, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

export default function NewTaskPage() {
  const { user } = useAuth();
  const { createTask } = useTasks();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    tags: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'La fecha de vencimiento no puede ser anterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      
      await createTask(taskData);
      router.push('/dashboard/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors({ submit: 'Error al crear la tarea. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/tasks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Nueva Tarea</h1>
          <p className="text-secondary-600">
            Crea una nueva tarea para organizar tu trabajo
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Tarea</CardTitle>
          <CardDescription>
            Completa la información para crear tu nueva tarea
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                Título *
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ingresa el título de la tarea"
                className={errors.title ? 'border-error-500' : ''}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe los detalles de la tarea"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.description ? 'border-error-500' : 'border-secondary-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Prioridad y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-secondary-700 mb-2">
                  Prioridad
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-2">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
            </div>

            {/* Fecha de vencimiento */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-secondary-700 mb-2">
                Fecha de Vencimiento *
              </label>
              <div className="relative">
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={errors.dueDate ? 'border-error-500' : ''}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-2">
                Etiquetas
              </label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Etiquetas separadas por comas (ej: trabajo, urgente, proyecto)"
              />
              <p className="mt-1 text-sm text-secondary-500">
                Separa las etiquetas con comas
              </p>
            </div>

            {/* Error de envío */}
            {errors.submit && (
              <div className="p-4 bg-error-50 border border-error-200 rounded-md">
                <p className="text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
              <Link href="/dashboard/tasks">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner h-4 w-4 mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear Tarea
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
