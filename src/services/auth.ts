import { api } from './api';

export const auth = {
  async login(username: string, password: string) {
    const response = await api.post('/api/token/', { username, password });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return { success: true };
    }

    return { success: false };
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};