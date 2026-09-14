import axios from 'axios';
import { BASE_URL } from './apiPath';

/**
 * Pre-configured Axios instance for SARAL API communications.
 * - Injects Base URL from environment or default
 * - Attaches JWT Bearer token from localStorage on authenticated requests
 * - Uniformly extracts error messages and manages session expiries
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set multipart/form-data boundary automatically when sending FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform response extraction and 401 handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Session expired or unauthorized
    if (error.response?.status === 401) {
      // Clear token if invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
