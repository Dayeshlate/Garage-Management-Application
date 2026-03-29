import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
apiClient.interceptors.request.use((config) => {
  const user = localStorage.getItem('garage_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

// Extract response data & handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status || 0;
    const responseData = error.response?.data;
    const message =
      (typeof responseData === 'string' && responseData) ||
      responseData?.message ||
      (status === 0 ? 'Cannot connect to backend. Configure VITE_API_URL and start your API server.' : error.message) ||
      'Request failed';

    return Promise.reject(new ApiError(status, message));
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
