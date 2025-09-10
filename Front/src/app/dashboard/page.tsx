'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { CheckSquare, Clock, CheckCircle, AlertTriangle, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { formatDate, formatRelativeDate, getPriorityColor, getStatusColor } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, stats, isLoadingTasks, isLoadingStats } = useTasks({ limit: 5 });

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          ¡Hola, {user?.name}! 👋
        </h1>
        <p className="text-primary-100">
          Aquí tienes un resumen de tu productividad hoy
        </p>
      </div>

      {/* Stats cards */}
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

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>
              Gestiona tus tareas de forma eficiente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/tasks/new">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Crear nueva tarea
              </Button>
            </Link>
            
            <Link href="/dashboard/tasks">
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                Ver todas las tareas
              </Button>
            </Link>
            
            <Link href="/dashboard/stats">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver estadísticas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progreso de productividad</CardTitle>
            <CardDescription>
              Tu rendimiento esta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Tareas completadas</span>
                <span className="text-sm font-medium">{stats?.completed || 0}</span>
              </div>
              
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-success-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats?.completionRate || 0}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Tasa de completado</span>
                <span className="font-medium">{stats?.completionRate || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tareas recientes</CardTitle>
            <CardDescription>
              Tus últimas tareas creadas
            </CardDescription>
          </div>
          <Link href="/dashboard/tasks">
            <Button variant="outline" size="sm">
              Ver todas
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentTasks.length > 0 ? (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-secondary-900 truncate">
                      {task.title}
                    </h3>
                    <p className="text-sm text-secondary-600 truncate">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant={task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'primary' : 'warning'}
                        size="sm"
                      >
                        {task.status === 'completed' ? 'Completada' : task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                      </Badge>
                      <Badge
                        variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-secondary-500">
                    {formatRelativeDate(task.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="mx-auto h-12 w-12 text-secondary-400 mb-4" />
              <h3 className="text-sm font-medium text-secondary-900 mb-2">
                No hay tareas
              </h3>
              <p className="text-sm text-secondary-600 mb-4">
                Comienza creando tu primera tarea
              </p>
              <Link href="/dashboard/tasks/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear tarea
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
