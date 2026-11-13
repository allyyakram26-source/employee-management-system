const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://employee-management-system-sandy.vercel.app/api';

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, ''); 