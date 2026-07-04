import axios from 'axios';

// Normalize the API base URL so it always ends in `/api`, regardless of
// whether VITE_API_URL was set with or without the trailing /api segment.
// This prevents silent 404s (and "login doesn't work") when the env var
// is set to just the bare backend origin.
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TRIMMED = RAW_API_URL.replace(/\/+$/, ''); // strip trailing slash(es)
const API_URL = TRIMMED.endsWith('/api') ? TRIMMED : `${TRIMMED}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
