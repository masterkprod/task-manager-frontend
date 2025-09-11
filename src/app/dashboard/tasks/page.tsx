'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { CheckSquare, Clock, CheckCircle, AlertTriangle, Plus, Filter, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { formatDate, formatRelativeDate, getPriorityColor, getStatusColor } from '@/lib/utils';

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, isLoadingTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Filtrar tareas
  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) : [];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Todas las Tareas</h1>
          <p className="text-secondary-600">
            Gestiona y organiza todas tus tareas
          </p>
        </div>
        <Link href="/dashboard/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Buscar
              </label>
              <Input
                placeholder="Buscar tareas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completada</option>
              </select>
            </div>

            {/* Filtro por prioridad */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Prioridad
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todas las prioridades</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tareas ({filteredTasks.length})
          </CardTitle>
          <CardDescription>
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Resultados filtrados' 
              : 'Todas tus tareas'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-secondary-900 mb-1">
                          {task.title}
                        </h3>
                        <p className="text-sm text-secondary-600 mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'primary' : 'warning'}
                            size="sm"
                          >
                            {getStatusText(task.status)}
                          </Badge>
                          <Badge
                            variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {getPriorityText(task.priority)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-secondary-500 ml-4">
                    {task.dueDate && (
                      <div className="flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(task.dueDate)}
                      </div>
                    )}
                    <div>
                      Creada {formatRelativeDate(task.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckSquare className="mx-auto h-16 w-16 text-secondary-400 mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'No se encontraron tareas' 
                  : 'No hay tareas'
                }
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primera tarea'
                }
              </p>
              {(!searchQuery && statusFilter === 'all' && priorityFilter === 'all') && (
                <Link href="/dashboard/tasks/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear tarea
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
