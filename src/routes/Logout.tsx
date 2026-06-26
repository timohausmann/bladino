import { clearSession } from '@/lib/auth';
import { setFlashMessage } from '@/lib/flashMessage';
import { queryClient } from '@/lib/queryClient';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

/**
 * Logout route that handles user logout and redirects to login
 */
export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    clearSession(queryClient);
    setFlashMessage('loggedOut');
    navigate({ to: '/login' });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500"></div>
        <p className="text-neutral-600 dark:text-neutral-400">Logging out...</p>
      </div>
    </div>
  );
}
