import { Button } from '@/components/ui/button';
import { clearSession } from '@/lib/auth';
import { setFlashMessage } from '@/lib/flashMessage';
import { logoutServerSession } from '@/lib/refreshSession';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Logout route that handles user logout and redirects to login.
 * The login page is only shown after the server has deleted the session.
 */
export function Logout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    let active = true;

    const logout = async () => {
      try {
        await logoutServerSession();
      } catch (error) {
        console.error('Logout request failed:', error);
        if (active) setFailed(true);
        return;
      }
      if (!active) return;
      clearSession();
      setFlashMessage('loggedOut');
      navigate({ to: '/login' });
    };

    void logout();
    return () => {
      active = false;
    };
  }, [failed, navigate]);

  const handleRetry = () => {
    setFailed(false);
  };

  if (failed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 px-4 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('auth:logoutFailed')}
          </p>
          <Button type="button" onClick={handleRetry}>
            {t('auth:logoutRetry')}
          </Button>
          <Link
            to="/"
            className="text-neutral-600 underline dark:text-neutral-400"
          >
            {t('common:back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500"></div>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('auth:loggingOut')}
        </p>
      </div>
    </div>
  );
}
