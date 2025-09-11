'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { ArrowLeft, TrendingUp, CheckSquare, Clock, CheckCircle, AlertTriangle, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function StatsPage() {
  const { user } = useAuth();
  const { tasks, stats, isLoadingTasks, isLoadingStats } = useTasks();
  
  const [timeRange, setTimeRange] = useState('week');


  // Calcular estadísticas adicionales
  const calculateAdditionalStats = () => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return {
        tasksThisWeek: 0,
        tasksThisMonth: 0,
        completedThisWeek: 0,
        completedThisMonth: 0,
        tasksByPriority: { high: 0, medium: 0, low: 0 },
        tasksByStatus: { pending: 0, 'in-progress': 0, completed: 0 },
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const tasksThisWeek = tasks.filter(task => new Date(task.createdAt) >= weekAgo);
    const tasksThisMonth = tasks.filter(task => new Date(task.createdAt) >= monthAgo);
    
    const completedThisWeek = tasksThisWeek.filter(task => task.status === 'completed');
    const completedThisMonth = tasksThisMonth.filter(task => task.status === 'completed');

    // Calcular tareas por prioridad
    const tasksByPriority = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    };

    // Calcular tareas por estado
    const tasksByStatus = {
      pending: tasks.filter(task => task.status === 'pending').length,
      'in-progress': tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
    };

    return {
      tasksThisWeek: tasksThisWeek.length,
      tasksThisMonth: tasksThisMonth.length,
      completedThisWeek: completedThisWeek.length,
      completedThisMonth: completedThisMonth.length,
      tasksByPriority,
      tasksByStatus,
    };
  };

  const additionalStats = calculateAdditionalStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error-600';
      case 'medium': return 'text-warning-600';
      case 'low': return 'text-success-600';
      default: return 'text-secondary-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-600';
      case 'in-progress': return 'text-primary-600';
      case 'pending': return 'text-warning-600';
      default: return 'text-secondary-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Estadísticas</h1>
          <p className="text-secondary-600">
            Analiza tu productividad y rendimiento
          </p>
        </div>
      </div>

      {/* Filtro de tiempo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Período de Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {[
              { value: 'week', label: 'Esta Semana' },
              { value: 'month', label: 'Este Mes' },
              { value: 'all', label: 'Todo el Tiempo' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
            <CheckSquare className="h-4 w-4 text-secondary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? '...' : stats?.total || 0}
            </div>
            <p className="text-xs text-secondary-600">
              Tareas creadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-success-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? '...' : stats?.completed || 0}
            </div>
            <p className="text-xs text-secondary-600">
              {stats?.completionRate || 0}% completado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-warning-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? '...' : stats?.pending || 0}
            </div>
            <p className="text-xs text-secondary-600">
              Por completar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-error-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? '...' : stats?.overdue || 0}
            </div>
            <p className="text-xs text-secondary-600">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas por período */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Tareas creadas y completadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Esta semana</span>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {additionalStats.tasksThisWeek} creadas
                  </div>
                  <div className="text-xs text-secondary-500">
                    {additionalStats.completedThisWeek} completadas
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Este mes</span>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {additionalStats.tasksThisMonth} creadas
                  </div>
                  <div className="text-xs text-secondary-500">
                    {additionalStats.completedThisMonth} completadas
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Distribución por Prioridad
            </CardTitle>
            <CardDescription>
              Tareas organizadas por nivel de prioridad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(additionalStats.tasksByPriority || {}).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución por estado */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Estado</CardTitle>
          <CardDescription>
            Estado actual de todas tus tareas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(additionalStats.tasksByStatus || {}).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {count}
                </div>
                <Badge
                  variant={status === 'completed' ? 'success' : status === 'in-progress' ? 'primary' : 'warning'}
                  size="sm"
                >
                  {status === 'completed' ? 'Completadas' : status === 'in-progress' ? 'En Progreso' : 'Pendientes'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progreso de productividad */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Productividad</CardTitle>
          <CardDescription>
            Tu rendimiento general
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Tasa de completado</span>
              <span className="text-sm font-medium">{stats?.completionRate || 0}%</span>
            </div>
            
            <div className="w-full bg-secondary-200 rounded-full h-3">
              <div
                className="bg-success-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats?.completionRate || 0}%` }}
              ></div>
            </div>
            
            <div className="text-center text-sm text-secondary-600">
              {stats?.completed || 0} de {stats?.total || 0} tareas completadas
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
