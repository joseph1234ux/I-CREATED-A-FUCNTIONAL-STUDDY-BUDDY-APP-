import axios from 'axios';

const configuredUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const baseURL = configuredUrl
  ? `${configuredUrl}${configuredUrl.endsWith('/api') ? '' : '/api'}`
  : '/api';

const clearAuthentication = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  Object.keys(localStorage)
    .filter((key) => key.startsWith('saved_'))
    .forEach((key) => localStorage.removeItem(key));
};

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthentication();

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export { clearAuthentication };
export default api;
