'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface SignupFormProps {
  onSubmit: (email: string, password: string, name: string) => Promise<void>;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password, name);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          placeholder="Create a password"
        />
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </form>
  );
}