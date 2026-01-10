export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}