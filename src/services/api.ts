const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const api = {
  async post(endpoint: string, data: object | FormData, auth = false) {
    const headers: Record<string, string> = {};
    
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (auth) {
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return response;
  },

  async get(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  },

  async delete(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  },

  async patch(endpoint: string, data: object | FormData) {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    };

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    return response;
  },
};