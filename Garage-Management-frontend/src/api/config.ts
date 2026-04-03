import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
apiClient.interceptors.request.use((config) => {
  let token: string | undefined;
  const user = localStorage.getItem('garage_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      token = parsed?.token;
    } catch {
      // Ignore parse failure and try legacy token key below.
    }
  }

  if (!token) {
    token = localStorage.getItem('token') || undefined;
  }

  if (token && token !== 'demo-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extract response data & handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    // Clear session only on unauthorized responses.
    // 403 can happen on role-protected routes and should not force logout.
    if (status === 401) {
      localStorage.removeItem('garage_user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new ApiError(status || 0, error.response?.data?.message || error.message);
  }
);

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export { apiClient };
