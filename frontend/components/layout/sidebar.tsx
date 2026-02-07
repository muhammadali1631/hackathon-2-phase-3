'use client';

import { Button } from '../ui/button';
import { LogOut, Home, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useLayout } from '@/providers/layout-provider';

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  // For mobile, we'll use a hamburger menu
  return (
    <>
      {/* Mobile sidebar - hidden by default, shown when hamburger is clicked */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Todo App</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSidebar}
            className="lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
            <p className="font-medium text-gray-800 uppercase dark:text-white truncate">{user?.name || user?.email}</p>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={closeSidebar}>
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>

            </ul>
          </nav>

          <div className="mt-8">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Desktop sidebar - always visible on larger screens */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Todo App</h1>
          </div>

          <div className="flex-1 p-4">
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
              <p className="font-medium text-gray-800 dark:text-white truncate">{user?.name || user?.email}</p>
            </div>

            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="mt-8">
              <Button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}