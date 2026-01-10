'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';
import { useAuth } from '@/providers/auth-provider';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      await signup(email, password, name);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 transform hover:shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign up to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <SignupForm onSubmit={handleSignup} />

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}