import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.clear();
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || error.response?.data?.detail || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) =>
    axiosInstance.post('/accounts/login/', credentials),

  register: (userData) =>
    axiosInstance.post('/accounts/register/', userData),

  logout: (refreshToken) =>
    axiosInstance.post('/accounts/logout/', {
      refresh: refreshToken,
    }),
};

// Ticket APIs
export const ticketAPI = {
  getAll: () => axiosInstance.get('/tickets/'),
  getById: (id) => axiosInstance.get(`/tickets/${id}/`),
  create: (data) => axiosInstance.post('/tickets/', data),
  update: (id, data) => axiosInstance.put(`/tickets/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/tickets/${id}/`),
};

// Customer APIs
export const customerAPI = {
  getAll: () => axiosInstance.get('/customers/'),
  create: (data) => axiosInstance.post('/customers/', data),
};

export default axiosInstance;