'use client';

import { Button } from '../ui/button';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useLayout } from '@/providers/layout-provider';

export function Header() {
  const { toggleSidebar, openSidebar } = useLayout();
  const { user } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={openSidebar}
            className="lg:hidden mr-2 text-gray-300 hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-300 hover:bg-gray-700"
            aria-label="Notifications"
          >
            {/* <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span> */}
          </Button>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-300 uppercase">
              {user?.name || user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}