const defaultApiBaseUrl = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://employee-management-system-sandy.vercel.app/api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, '');