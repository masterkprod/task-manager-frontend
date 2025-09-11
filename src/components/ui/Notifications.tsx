'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import Button from './Button';
import { Card, CardContent } from './Card';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Bienvenido al Task Manager',
      message: '¡Comienza creando tu primera tarea para organizar tu trabajo!',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Tarea completada',
      message: 'Has completado la tarea "Revisar documentación"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Tarea próxima a vencer',
      message: 'La tarea "Preparar presentación" vence en 2 horas',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      read: true
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-error-600" />;
      default:
        return <Info className="h-4 w-4 text-primary-600" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'error':
        return 'bg-error-50 border-error-200';
      default:
        return 'bg-primary-50 border-primary-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white border border-secondary-200 rounded-lg shadow-lg z-50"
    >
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            Notificaciones
          </h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="mx-auto h-8 w-8 text-secondary-400 mb-2" />
            <p className="text-sm text-secondary-600">No hay notificaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-secondary-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-secondary-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary-500 mt-2">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 h-6 w-6"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-secondary-200 bg-secondary-50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm"
            onClick={() => {
              // Aquí podrías implementar la lógica para ver todas las notificaciones
              console.log('Ver todas las notificaciones');
            }}
          >
            Ver todas las notificaciones
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
