import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, PaginatedResponse, Task, TaskStats, User } from '@/types';

/**
 * Cliente API para comunicación con el backend
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configurar interceptores para manejo de tokens y errores
   */
  private setupInterceptors(): void {
    // Interceptor de request para agregar token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response para manejo de errores
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no es un retry, intentar refrescar token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const newToken = this.getToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Si falla el refresh, limpiar tokens y redirigir a login
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtener token del localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Guardar tokens en localStorage
   */
  private setTokens(accessToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
  }

  /**
   * Limpiar tokens del localStorage
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  }

  /**
   * Refrescar token de acceso
   */
  private async refreshToken(): Promise<void> {
    const response = await this.client.post<ApiResponse<{ accessToken: string }>>('/api/auth/refresh');
    if (response.data.success && response.data.data?.accessToken) {
      this.setTokens(response.data.data.accessToken);
    }
  }

  // ===== AUTENTICACIÓN =====

  /**
   * Registrar nuevo usuario
   */
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/register', data);
    if (response.data.success && response.data.data.accessToken) {
      this.setTokens(response.data.data.accessToken);
    }
    return response.data;
  }

  /**
   * Iniciar sesión
   */
  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', data);
    if (response.data.success && response.data.data.accessToken) {
      this.setTokens(response.data.data.accessToken);
    }
    return response.data;
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>('/api/auth/logout');
    this.clearTokens();
    return response.data;
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.client.get<ApiResponse<{ user: User }>>('/api/auth/profile');
    return response.data;
  }

  // ===== USUARIOS =====

  /**
   * Actualizar perfil del usuario autenticado
   */
  async updateProfile(data: { name?: string; email?: string }): Promise<ApiResponse<{ user: User }>> {
    const response = await this.client.put<ApiResponse<{ user: User }>>('/api/users/profile', data);
    return response.data;
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    const response = await this.client.put<ApiResponse>('/api/users/change-password', data);
    return response.data;
  }

  /**
   * Desactivar cuenta
   */
  async deactivateAccount(): Promise<ApiResponse> {
    const response = await this.client.put<ApiResponse>('/api/users/deactivate');
    this.clearTokens();
    return response.data;
  }

  /**
   * Obtener todos los usuarios (solo admin)
   */
  async getUsers(params?: { page?: number; limit?: number; role?: string; isActive?: boolean }): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<PaginatedResponse<User>>('/api/users', { params });
    return response.data;
  }

  /**
   * Obtener usuario por ID (solo admin)
   */
  async getUserById(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await this.client.get<ApiResponse<{ user: User }>>(`/api/users/${id}`);
    return response.data;
  }

  /**
   * Actualizar usuario por ID (solo admin)
   */
  async updateUserById(id: string, data: { name?: string; email?: string; role?: string; isActive?: boolean }): Promise<ApiResponse<{ user: User }>> {
    const response = await this.client.put<ApiResponse<{ user: User }>>(`/api/users/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar usuario por ID (solo admin)
   */
  async deleteUserById(id: string): Promise<ApiResponse> {
    const response = await this.client.delete<ApiResponse>(`/api/users/${id}`);
    return response.data;
  }

  // ===== TAREAS =====

  /**
   * Crear nueva tarea
   */
  async createTask(data: { title: string; description: string; status?: string; priority?: string; dueDate?: string }): Promise<ApiResponse<{ task: Task }>> {
    const response = await this.client.post<ApiResponse<{ task: Task }>>('/api/tasks', data);
    return response.data;
  }

  /**
   * Obtener tareas
   */
  async getTasks(params?: { page?: number; limit?: number; status?: string; priority?: string; search?: string; dueDate?: string; userId?: string }): Promise<PaginatedResponse<Task>> {
    const response = await this.client.get<PaginatedResponse<Task>>('/api/tasks', { params });
    return response.data;
  }

  /**
   * Obtener estadísticas de tareas
   */
  async getTaskStats(params?: { userId?: string }): Promise<ApiResponse<{ stats: TaskStats }>> {
    const response = await this.client.get<ApiResponse<{ stats: TaskStats }>>('/api/tasks/stats', { params });
    return response.data;
  }

  /**
   * Obtener tarea por ID
   */
  async getTaskById(id: string): Promise<ApiResponse<{ task: Task }>> {
    const response = await this.client.get<ApiResponse<{ task: Task }>>(`/api/tasks/${id}`);
    return response.data;
  }

  /**
   * Actualizar tarea
   */
  async updateTask(id: string, data: { title?: string; description?: string; status?: string; priority?: string; dueDate?: string }): Promise<ApiResponse<{ task: Task }>> {
    const response = await this.client.put<ApiResponse<{ task: Task }>>(`/api/tasks/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar tarea
   */
  async deleteTask(id: string): Promise<ApiResponse> {
    const response = await this.client.delete<ApiResponse>(`/api/tasks/${id}`);
    return response.data;
  }

  // ===== SISTEMA =====

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.client.get<ApiResponse>('/health');
    return response.data;
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();
export default apiClient;
