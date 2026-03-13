const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_ROLE_KEY = 'user_role';

const normalizeRole = (role) => role.replace(/^ROLE_/i, '').trim().toUpperCase();

const toRoleList = (roles) => {
  if (!roles) return [];
  if (Array.isArray(roles)) {
    return roles.map((role) => normalizeRole(String(role))).filter(Boolean);
  }
  if (typeof roles === 'string') {
    return roles
      .split(/[\s,]+/)
      .map((role) => normalizeRole(role))
      .filter(Boolean);
  }
  return [];
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Erro ao ler auth_user do localStorage:', error);
    return null;
  }
};

export const getStoredRoles = () => {
  const user = getStoredUser();
  if (user?.roles) {
    return toRoleList(user.roles);
  }
  if (typeof window !== 'undefined') {
    const legacyRole = localStorage.getItem(AUTH_ROLE_KEY);
    return toRoleList(legacyRole);
  }
  return [];
};

export const hasRole = (role) => {
  const roles = getStoredRoles();
  return roles.includes(normalizeRole(role));
};

export const setAuthSession = ({ token, user }) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    const roles = toRoleList(user.roles);
    if (roles.length > 0) {
      const primaryRole = roles.includes('ADMIN') ? 'admin' : roles[0].toLowerCase();
      localStorage.setItem(AUTH_ROLE_KEY, primaryRole);
    }
  }
};

export const clearAuthSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
};
