const AUTH_TOKEN_KEY = 'bladino.authToken';

// Access JWTs stay in memory. The refresh cookie is what survives a reload.
// The localStorage key is a leftover from before sessions. Nothing reads it.
// The removes below only clear it. Safe to delete 7 days after the session server ships.
let authToken: string | null = null;
let storedTokenDiscarded = false;

/** Drops pre-session JWTs. Those logins start again instead of being migrated. */
export function discardStoredAccessToken(): void {
  if (storedTokenDiscarded || typeof window === 'undefined') return;
  storedTokenDiscarded = true;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthToken(): string | null {
  return authToken;
}

export function setAuthToken(token: string): void {
  authToken = token;
}

export function clearAuthToken(): void {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
