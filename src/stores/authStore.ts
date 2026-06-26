const AUTH_TOKEN_KEY = 'bladino.authToken';

let authToken: string | null =
  typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

export function getAuthToken(): string | null {
  return authToken;
}

export function setAuthToken(token: string): void {
  authToken = token;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  authToken = null;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
