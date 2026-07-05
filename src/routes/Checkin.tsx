import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Card } from '@/components/ui/Card';
import { Banner } from '@/components/ui/Banner';
import {
  isTransportError,
  LoginMagicDocument,
  useGraphQLMutation,
} from '@/graphql';
import { ensureSession } from '@/lib/auth';
import { resetExpiredSessionGuard } from '@/lib/expiredSession';
import { setAuthToken } from '@/stores/authStore';

/**
 * Magic-link callback at /checkin/:token — exchanges the JWT for a session.
 */
export function Checkin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams({ from: '/checkin/$token' });
  const attemptedRef = useRef(false);

  const loginMagicMutation = useGraphQLMutation(LoginMagicDocument, {
    onSuccess: async (data) => {
      if (!data.loginMagic) {
        return;
      }
      resetExpiredSessionGuard();
      setAuthToken(data.loginMagic);
      await ensureSession();
      navigate({ to: '/', replace: true });
    },
  });

  const { mutate, isPending, isError, error } = loginMagicMutation;

  useEffect(() => {
    if (!token || attemptedRef.current) return;
    attemptedRef.current = true;
    mutate({ token: decodeURIComponent(token) });
  }, [token, mutate]);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xl">
          <Card className="flex flex-col gap-6">
            <p className="text-muted-foreground text-center">
              {t('auth:magicLoginPending')}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xl">
          <Card className="flex flex-col gap-6">
            <Banner
              message={
                isTransportError(error)
                  ? t('auth:errorTransport')
                  : t('auth:magicLoginError')
              }
              variant="negative"
            />
            <p className="text-center">
              <a
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground underline decoration-transparent transition-colors duration-200 hover:decoration-current"
              >
                {t('auth:passwordlessLogin')}
              </a>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
