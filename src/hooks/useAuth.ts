import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { User, LoginForm, RegisterForm, ProfileForm, ChangePasswordForm } from '@/types';

/**
 * Hook para manejo de autenticación
 */
export function useAuth() {
  console.log('useAuth hook called');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  console.log('Current user state:', user);
  console.log('Current loading state:', isLoading);

  // Query para obtener perfil del usuario
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      console.log('Profile query function called');
      return apiClient.getProfile();
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: 1, // Permitir un reintento
    staleTime: 5 * 60 * 1000, // 5 minutos
    onError: (error) => {
      console.error('Profile query onError:', error);
    },
    onSuccess: (data) => {
      console.log('Profile query onSuccess:', data);
    },
  });

  // Efecto para actualizar usuario cuando se obtiene el perfil
  useEffect(() => {
    console.log('Profile data changed:', profileData);
    console.log('Profile loading:', isProfileLoading);
    
    if (profileData?.success && profileData.data?.user) {
      console.log('Setting user from profile data:', profileData.data.user);
      setUser(profileData.data.user);
    }
    setIsLoading(isProfileLoading);
  }, [profileData, isProfileLoading]);

  // Efecto para manejar errores del perfil
  useEffect(() => {
    if (profileError) {
      console.warn('Profile error:', profileError);
      console.warn('Profile error response:', (profileError as any).response?.data);
      console.warn('Current token:', typeof window !== 'undefined' ? localStorage.getItem('accessToken') : 'N/A');
      
      // Solo limpiar el usuario si no hay un usuario ya establecido (evitar loop)
      if (!user) {
        console.log('No user set, clearing tokens and redirecting to login');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        setUser(null);
        setIsLoading(false);
      } else {
        console.log('User already set, not clearing to avoid loop');
      }
    }
  }, [profileError, user]);

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => apiClient.login(data),
    onSuccess: async (response) => {
      console.log('Login success response:', response);
      
      if (response.success && response.data?.user) {
        console.log('Setting user from login response:', response.data.user);
        setUser(response.data.user);
        toast.success('¡Bienvenido!');
        
        // Esperar un poco para que las cookies se establezcan
        console.log('Waiting for cookies to be set...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Invalidar y refetch el perfil para asegurar que tenemos los datos más recientes
        console.log('Invalidating profile queries...');
        await queryClient.invalidateQueries({ queryKey: ['profile'] });
        
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => apiClient.register(data),
    onSuccess: (response) => {
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast.success('¡Cuenta creada exitosamente!');
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear cuenta';
      toast.error(message);
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
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
  });

  // Mutation para actualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileForm) => apiClient.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast.success('Perfil actualizado exitosamente');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(message);
    },
  });

  // Mutation para cambiar contraseña
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordForm) => apiClient.changePassword(data),
    onSuccess: () => {
      toast.success('Contraseña actualizada exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cambiar contraseña';
      toast.error(message);
    },
  });

  // Mutation para desactivar cuenta
  const deactivateAccountMutation = useMutation({
    mutationFn: () => apiClient.deactivateAccount(),
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
  });

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
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isDeactivateLoading: deactivateAccountMutation.isPending,
  };
}
