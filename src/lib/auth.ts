import { message } from 'antd';

const TOKEN_KEY = 'auth_token';

export const UNAUTHORIZED_MESSAGE = 'UNAUTHORIZED';

export function redirectToLoginIfUnauthorized(
  error: unknown,
  router: { push: (url: string) => void }
): boolean {
  if (error instanceof Error && error.message === UNAUTHORIZED_MESSAGE) {
    message.info('Sua sessão expirou. Por favor, faça login novamente para continuar.');
    removeToken();
    router.push('/login');
    return true;
  }
  return false;
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const getTokenFromCookie = (cookieHeader?: string): string | null => {
  if (!cookieHeader) {
    return null;
  }
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  return cookies[TOKEN_KEY] || null;
};
