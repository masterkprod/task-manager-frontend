import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { User, LoginForm, RegisterForm, ProfileForm, ChangePasswordForm } from '@/types';

/**
 * Hook para manejo de autenticación
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query para obtener perfil del usuario
  const { data: profileData, isLoading: isProfileLoading } = useQuery(
    'profile',
    () => apiClient.getProfile(),
    {
      enabled: !!localStorage.getItem('accessToken'),
      retry: false,
      onError: () => {
        localStorage.removeItem('accessToken');
        setUser(null);
      },
    }
  );

  // Efecto para actualizar usuario cuando se obtiene el perfil
  useEffect(() => {
    if (profileData?.success && profileData.data?.user) {
      setUser(profileData.data.user);
    }
    setIsLoading(isProfileLoading);
  }, [profileData, isProfileLoading]);

  // Mutation para login
  const loginMutation = useMutation(
    (data: LoginForm) => apiClient.login(data),
    {
      onSuccess: (response) => {
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          queryClient.invalidateQueries('profile');
          toast.success('¡Bienvenido!');
          router.push('/dashboard');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al iniciar sesión';
        toast.error(message);
      },
    }
  );

  // Mutation para registro
  const registerMutation = useMutation(
    (data: RegisterForm) => apiClient.register(data),
    {
      onSuccess: (response) => {
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          queryClient.invalidateQueries('profile');
          toast.success('¡Cuenta creada exitosamente!');
          router.push('/dashboard');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al crear cuenta';
        toast.error(message);
      },
    }
  );

  // Mutation para logout
  const logoutMutation = useMutation(
    () => apiClient.logout(),
    {
      onSuccess: () => {
        setUser(null);
        queryClient.clear();
        toast.success('Sesión cerrada');
        router.push('/auth/login');
      },
      onError: () => {
        // Aún así limpiar el estado local
        setUser(null);
        queryClient.clear();
        router.push('/auth/login');
      },
    }
  );

  // Mutation para actualizar perfil
  const updateProfileMutation = useMutation(
    (data: ProfileForm) => apiClient.updateProfile(data),
    {
      onSuccess: (response) => {
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          queryClient.invalidateQueries('profile');
          toast.success('Perfil actualizado exitosamente');
        }
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al actualizar perfil';
        toast.error(message);
      },
    }
  );

  // Mutation para cambiar contraseña
  const changePasswordMutation = useMutation(
    (data: ChangePasswordForm) => apiClient.changePassword(data),
    {
      onSuccess: () => {
        toast.success('Contraseña actualizada exitosamente');
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al cambiar contraseña';
        toast.error(message);
      },
    }
  );

  // Mutation para desactivar cuenta
  const deactivateAccountMutation = useMutation(
    () => apiClient.deactivateAccount(),
    {
      onSuccess: () => {
        setUser(null);
        queryClient.clear();
        toast.success('Cuenta desactivada');
        router.push('/auth/login');
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al desactivar cuenta';
        toast.error(message);
      },
    }
  );

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = useCallback(() => {
    return !!user && !!localStorage.getItem('accessToken');
  }, [user]);

  // Función para verificar si el usuario es admin
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  // Función para login
  const login = useCallback((data: LoginForm) => {
    loginMutation.mutate(data);
  }, [loginMutation]);

  // Función para registro
  const register = useCallback((data: RegisterForm) => {
    registerMutation.mutate(data);
  }, [registerMutation]);

  // Función para logout
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // Función para actualizar perfil
  const updateProfile = useCallback((data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  }, [updateProfileMutation]);

  // Función para cambiar contraseña
  const changePassword = useCallback((data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data);
  }, [changePasswordMutation]);

  // Función para desactivar cuenta
  const deactivateAccount = useCallback(() => {
    deactivateAccountMutation.mutate();
  }, [deactivateAccountMutation]);

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deactivateAccount,
    isLoginLoading: loginMutation.isLoading,
    isRegisterLoading: registerMutation.isLoading,
    isLogoutLoading: logoutMutation.isLoading,
    isUpdateProfileLoading: updateProfileMutation.isLoading,
    isChangePasswordLoading: changePasswordMutation.isLoading,
    isDeactivateLoading: deactivateAccountMutation.isLoading,
  };
}
