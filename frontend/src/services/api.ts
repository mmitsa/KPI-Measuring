import axios, { AxiosError, AxiosResponse } from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Extract data from ApiResponse<T> structure
    if (response.data && response.data.Data) {
      return { ...response, data: response.data.Data };
    }
    return response;
  },
  (error: AxiosError<any>) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }

    // Extract error message
    const errorMessage =
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.message ||
      'حدث خطأ غير متوقع';

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

export default api;
