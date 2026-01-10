import { User } from '@/types';
import { apiService } from './api';

class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return apiService.login(email, password);
  }

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    return apiService.signup(email, password, name);
  }

  async logout(): Promise<void> {
    return apiService.logout();
  }

  async getProfile(): Promise<User> {
    return apiService.getProfile();
  }

  isAuthenticated(): boolean {
    return !!apiService.getToken();
  }
}

export const authService = new AuthService();