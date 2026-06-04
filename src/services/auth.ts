import { api } from './api';

export const auth = {
  async login(username: string, password: string) {
    const response = await api.post('/api/token/', { username, password }, false);
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      const meResponse = await api.get('/api/me/');
      if (meResponse.ok) {
        const me = await meResponse.json();
        localStorage.setItem('perfil', me.perfil);
        localStorage.setItem('username', me.username);
      }
      return { success: true };
    }

    return { success: false };
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('perfil');
    localStorage.removeItem('username');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  getPerfil() {
    return localStorage.getItem('perfil');
  },

  getUsername() {
    return localStorage.getItem('username');
  },
};