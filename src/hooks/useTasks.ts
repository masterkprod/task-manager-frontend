import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { Task, TaskForm, TaskFilters, TaskStats } from '@/types';

/**
 * Hook para manejo de tareas
 */
export function useTasks(filters?: TaskFilters) {
  const queryClient = useQueryClient();
  const [currentFilters, setCurrentFilters] = useState<TaskFilters>(filters || {});

  // Query para obtener tareas
  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', currentFilters],
    queryFn: () => apiClient.getTasks(currentFilters),
    placeholderData: (previousData) => previousData,
  });

  // Query para obtener estadísticas
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['taskStats'],
    queryFn: () => apiClient.getTaskStats(),
  });

  // Efecto para manejar errores de tareas
  useEffect(() => {
    if (tasksError) {
      console.error('Tasks error:', tasksError);
      const message = (tasksError as any).response?.data?.message || 'Error al cargar tareas';
      toast.error(message);
    }
  }, [tasksError]);

  // Efecto para manejar errores de estadísticas
  useEffect(() => {
    if (statsError) {
      console.error('Stats error:', statsError);
      const message = (statsError as any).response?.data?.message || 'Error al cargar estadísticas';
      toast.error(message);
    }
  }, [statsError]);

  // Mutation para crear tarea
  const createTaskMutation = useMutation({
    mutationFn: (data: TaskForm) => apiClient.createTask(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
        toast.success('Tarea creada exitosamente');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear tarea';
      toast.error(message);
    },
  });

  // Mutation para actualizar tarea
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskForm> }) => apiClient.updateTask(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
        toast.success('Tarea actualizada exitosamente');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar tarea';
      toast.error(message);
    },
  });

  // Mutation para eliminar tarea
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteTask(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
        toast.success('Tarea eliminada exitosamente');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar tarea';
      toast.error(message);
    },
  });

  // Función para actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setCurrentFilters({});
  }, []);

  // Función para crear tarea
  const createTask = useCallback((data: TaskForm) => {
    createTaskMutation.mutate(data);
  }, [createTaskMutation]);

  // Función para actualizar tarea
  const updateTask = useCallback((id: string, data: Partial<TaskForm>) => {
    updateTaskMutation.mutate({ id, data });
  }, [updateTaskMutation]);

  // Función para eliminar tarea
  const deleteTask = useCallback((id: string) => {
    deleteTaskMutation.mutate(id);
  }, [deleteTaskMutation]);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    refetchTasks();
    refetchStats();
  }, [refetchTasks, refetchStats]);

  return {
    // Datos
    tasks: (tasksData?.data?.tasks || []) as Task[],
    pagination: tasksData?.data?.pagination,
    stats: statsData?.data?.stats as TaskStats | undefined,
    filters: currentFilters,

    // Estados de carga
    isLoadingTasks,
    isLoadingStats,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,

    // Errores
    tasksError,

    // Funciones
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
    clearFilters,
    refresh,
  };
}

/**
 * Hook para obtener una tarea específica
 */
export function useTask(id: string) {
  const queryClient = useQueryClient();

  // Query para obtener tarea por ID
  const {
    data: taskData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['task', id],
    queryFn: () => apiClient.getTaskById(id),
    enabled: !!id,
  });

  // Efecto para manejar errores de tarea individual
  useEffect(() => {
    if (error) {
      const message = (error as any).response?.data?.message || 'Error al cargar tarea';
      toast.error(message);
    }
  }, [error]);

  // Mutation para actualizar tarea
  const updateTaskMutation = useMutation({
    mutationFn: (data: Partial<TaskForm>) => apiClient.updateTask(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['task', id] });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
        toast.success('Tarea actualizada exitosamente');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar tarea';
      toast.error(message);
    },
  });

  // Mutation para eliminar tarea
  const deleteTaskMutation = useMutation({
    mutationFn: () => apiClient.deleteTask(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
        toast.success('Tarea eliminada exitosamente');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar tarea';
      toast.error(message);
    },
  });

  // Función para actualizar tarea
  const updateTask = useCallback((data: Partial<TaskForm>) => {
    updateTaskMutation.mutate(data);
  }, [updateTaskMutation]);

  // Función para eliminar tarea
  const deleteTask = useCallback(() => {
    deleteTaskMutation.mutate();
  }, [deleteTaskMutation]);

  return {
    task: taskData?.data as Task | undefined,
    isLoading,
    error,
    updateTask,
    deleteTask,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    refetch,
  };
}
