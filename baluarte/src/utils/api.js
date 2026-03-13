import { getAuthToken } from './auth.js';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const apiFetch = async (path, options = {}) => {
  const token = options.token ?? getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body;
  if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
    if (typeof body !== 'string') {
      body = JSON.stringify(body);
    }
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });
};
