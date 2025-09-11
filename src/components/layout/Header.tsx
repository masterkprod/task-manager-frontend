'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Bell, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Notifications from '@/components/ui/Notifications';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <Input
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="w-64"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full"></span>
            </Button>
            <Notifications
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-secondary-900">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-500">
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </p>
            </div>
            
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
