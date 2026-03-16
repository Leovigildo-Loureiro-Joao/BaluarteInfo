import { clearAuthSession, getAuthToken, getStoredUser, setAuthSession } from './auth.js';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const REFRESH_PATH = '/auth/refresh';
let refreshInFlight = null;

const refreshAuthToken = async () => {
  const token = getAuthToken();
  if (!token) return null;
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${REFRESH_PATH}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) return null;
      const payload = await response.json().catch(() => null);
      const nextToken = payload?.token;
      if (!nextToken) return null;
      setAuthSession({ token: nextToken, user: getStoredUser() });
      return nextToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
};

const doFetch = async (path, options = {}, tokenOverride) => {
  const token = tokenOverride ?? options.token ?? getAuthToken();
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

export const apiFetch = async (path, options = {}) => {
  const response = await doFetch(path, options);

  const shouldTryRefresh =
    response.status === 401 &&
    path !== REFRESH_PATH &&
    !String(path).startsWith('/auth/') &&
    !options.__retry &&
    Boolean(getAuthToken());

  if (!shouldTryRefresh) return response;

  const newToken = await refreshAuthToken();
  if (!newToken) {
    clearAuthSession();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
      window.location.assign('/auth/login');
    }
    return response;
  }

  return doFetch(path, { ...options, __retry: true }, newToken);
};
