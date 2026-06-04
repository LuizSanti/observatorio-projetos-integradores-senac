const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ── Refresh automático ───────────────────────────────────────────
// Controle para evitar múltiplos refreshes simultâneos.
// Cenário sem isso: 3 requests falham com 401 ao mesmo tempo →
// 3 tentativas de refresh em paralelo → race condition → logout inesperado
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  // Se já está renovando, entra na fila e aguarda
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push((newToken) => resolve(newToken));
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);

      // Se ROTATE_REFRESH_TOKENS=True no Django, salva o novo refresh token
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }

      // Desbloqueia todos que estavam esperando com o novo token
      refreshQueue.forEach((cb) => cb(data.access));
      refreshQueue = [];

      return data.access;
    } else {
      // Refresh token expirado ou inválido — sessão encerrada
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("perfil");
      localStorage.removeItem("username");

      // Redireciona para login
      window.location.href = "/";
      return null;
    }
  } finally {
    isRefreshing = false;
  }
}

// ── Montagem de headers ──────────────────────────────────────────
// Centralizado para não repetir em cada método
function buildHeaders(
  data?: object | FormData,
  includeAuth = true
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Content-Type só para JSON — FormData define o próprio boundary
  if (data && !(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (includeAuth) {
    const token = localStorage.getItem("access_token");
    // Só adiciona se token existe — evita "Bearer null"
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// ── Fetch com retry automático em 401 ───────────────────────────
// Toda requisição passa por aqui.
// Se receber 401, tenta renovar o token e refaz a requisição uma vez.
// Se renovar falhar, redireciona para login (dentro de tryRefreshToken).
async function fetchWithRefresh(
  endpoint: string,
  options: RequestInit,
  isAuthRequest = false  // true só para /api/token/ — não tenta refresh nesse caso
): Promise<Response> {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  // Não tenta refresh em rotas de autenticação (evita loop)
  if (response.status === 401 && !isAuthRequest) {
    const newToken = await tryRefreshToken();

    if (newToken) {
      // Refaz a requisição original com o novo token
      const retryOptions: RequestInit = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      };
      return fetch(`${API_URL}${endpoint}`, retryOptions);
    }
  }

  return response;
}

// ── API pública ──────────────────────────────────────────────────
export const api = {
  async post(endpoint: string, data: object | FormData, requiresAuth = true) {
    // requiresAuth=true por padrão agora — só /api/token/ passa false
    const headers = buildHeaders(data, requiresAuth);
    const isAuthRequest = endpoint === "/api/token/";

    return fetchWithRefresh(
      endpoint,
      {
        method: "POST",
        headers,
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      isAuthRequest
    );
  },

  async get(endpoint: string) {
    return fetchWithRefresh(endpoint, {
      headers: buildHeaders(undefined, true),
    });
  },

  async patch(endpoint: string, data: object | FormData) {
    return fetchWithRefresh(endpoint, {
      method: "PATCH",
      headers: buildHeaders(data, true),
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  async delete(endpoint: string) {
    return fetchWithRefresh(endpoint, {
      method: "DELETE",
      headers: buildHeaders(undefined, true),
    });
  },
};