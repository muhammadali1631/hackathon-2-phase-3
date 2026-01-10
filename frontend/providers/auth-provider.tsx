'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { authService } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token if authentication fails
        await authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: userData, token } = await authService.login(email, password);
    setUser(userData);
    return userData;
  };

  const signup = async (email: string, password: string, name: string) => {
    const { user: userData, token } = await authService.signup(email, password, name);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}