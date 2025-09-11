/**
 * Tipos principales de la aplicación
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  userId: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
  overdue: number;
  completionRate: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string; // Opcional para compatibilidad
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationResponse;
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: PaginationResponse;
  };
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskForm {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface ProfileForm {
  name: string;
  email: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TaskFilters {
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  dueDate?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  role?: 'user' | 'admin';
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type UserRole = 'user' | 'admin';

export interface Theme {
  mode: 'light' | 'dark';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}
