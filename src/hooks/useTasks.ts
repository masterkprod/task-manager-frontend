import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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
  } = useQuery(
    ['tasks', currentFilters],
    () => apiClient.getTasks(currentFilters),
    {
      keepPreviousData: true,
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al cargar tareas';
        toast.error(message);
      },
    }
  );

  // Query para obtener estadísticas
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery(
    'taskStats',
    () => apiClient.getTaskStats(),
    {
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al cargar estadísticas';
        toast.error(message);
      },
    }
  );

  // Mutation para crear tarea
  const createTaskMutation = useMutation(
    (data: TaskForm) => apiClient.createTask(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries('tasks');
          queryClient.invalidateQueries('taskStats');
          toast.success('Tarea creada exitosamente');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al crear tarea';
        toast.error(message);
      },
    }
  );

  // Mutation para actualizar tarea
  const updateTaskMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<TaskForm> }) => apiClient.updateTask(id, data),
    {
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries('tasks');
          queryClient.invalidateQueries('taskStats');
          toast.success('Tarea actualizada exitosamente');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al actualizar tarea';
        toast.error(message);
      },
    }
  );

  // Mutation para eliminar tarea
  const deleteTaskMutation = useMutation(
    (id: string) => apiClient.deleteTask(id),
    {
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries('tasks');
          queryClient.invalidateQueries('taskStats');
          toast.success('Tarea eliminada exitosamente');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al eliminar tarea';
        toast.error(message);
      },
    }
  );

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
    tasks: tasksData?.data || [],
    pagination: tasksData?.pagination,
    stats: statsData?.data?.stats as TaskStats | undefined,
    filters: currentFilters,

    // Estados de carga
    isLoadingTasks,
    isLoadingStats,
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,

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
  } = useQuery(
    ['task', id],
    () => apiClient.getTaskById(id),
    {
      enabled: !!id,
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al cargar tarea';
        toast.error(message);
      },
    }
  );

  // Mutation para actualizar tarea
  const updateTaskMutation = useMutation(
    (data: Partial<TaskForm>) => apiClient.updateTask(id, data),
    {
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries(['task', id]);
          queryClient.invalidateQueries('tasks');
          queryClient.invalidateQueries('taskStats');
          toast.success('Tarea actualizada exitosamente');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al actualizar tarea';
        toast.error(message);
      },
    }
  );

  // Mutation para eliminar tarea
  const deleteTaskMutation = useMutation(
    () => apiClient.deleteTask(id),
    {
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries('tasks');
          queryClient.invalidateQueries('taskStats');
          toast.success('Tarea eliminada exitosamente');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al eliminar tarea';
        toast.error(message);
      },
    }
  );

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
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
    refetch,
  };
}
