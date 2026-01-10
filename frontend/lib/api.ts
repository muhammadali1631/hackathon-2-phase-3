import { Task, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      if (!this.token) {
        this.token = localStorage.getItem('auth_token');
      }
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add token to headers if available
    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.status}`);
    }

    // Handle responses that don't have content (e.g., 204 No Content)
    if (response.status === 204) {
      return {} as T; // Return empty object for 204 responses
    }

    return response.json();
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/me');
  }

  // Task methods
  async getTasks(): Promise<{ tasks: Task[] }> {
    const response = await this.request<Task[]>('/');
    // The backend returns the tasks array directly, so we wrap it in the expected format
    return { tasks: response };
  }

  async createTask(taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ task: Task }> {
    const response = await this.request<Task>('/', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    // The backend returns the task directly, so we wrap it in the expected format
    return { task: response };
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<{ task: Task }> {
    const response = await this.request<Task>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    // The backend returns the task directly, so we wrap it in the expected format
    return { task: response };
  }

  async toggleTaskCompletion(id: string, completed: boolean): Promise<{ task: Task }> {
    const response = await this.request<Task>(`/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
    // The backend returns the task directly, so we wrap it in the expected format
    return { task: response };
  }

  async deleteTask(id: string): Promise<{ success: boolean }> {
    await this.request<null>(`/${id}`, {
      method: 'DELETE',
    });
    // DELETE returns 204 No Content, so we return success manually
    return { success: true };
  }
}

export const apiService = new ApiService();