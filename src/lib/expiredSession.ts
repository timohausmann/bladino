import { toast } from '@/components/ui/toast';
import { clearSession } from '@/lib/auth';
import { setFlashMessage } from '@/lib/flashMessage';

let redirectToLogin: (() => void) | null = null;
let handlingExpiredSession = false;
let unauthorizedNotified = false;

const UNAUTHORIZED_TOAST_COOLDOWN_MS = 3000;

/** Clears the one-shot guard so a future expiry can be handled after re-login. */
export function resetExpiredSessionGuard(): void {
  handlingExpiredSession = false;
}

/** Wire up SPA navigation to login — called once from main.tsx. */
export function registerExpiredSessionRedirect(fn: () => void): void {
  redirectToLogin = fn;
}

/** Clears the session, stores a login flash, and redirects when appropriate. */
export function handleExpiredSession(): void {
  if (handlingExpiredSession) {
    return;
  }
  handlingExpiredSession = true;

  clearSession();
  setFlashMessage('sessionExpired');

  const path = window.location.pathname;
  if (path === '/login' || path === '/logout') {
    return;
  }

  if (redirectToLogin) {
    redirectToLogin();
    return;
  }

  const returnTo = encodeURIComponent(
    window.location.pathname + window.location.search,
  );
  window.location.assign(`/login?returnTo=${returnTo}`);
}

/** Show a one-shot toast for auth middleware "unauthorized" responses. */
export function notifyUnauthorized(): void {
  if (unauthorizedNotified) {
    return;
  }
  unauthorizedNotified = true;
  toast('Unauthorized.');
  window.setTimeout(() => {
    unauthorizedNotified = false;
  }, UNAUTHORIZED_TOAST_COOLDOWN_MS);
}
