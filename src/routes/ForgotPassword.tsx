import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Banner } from '@/components/ui/Banner';
import {
  getGraphQLErrorMessage,
  isTransportError,
  RequestMagicDocument,
  useGraphQLMutation,
} from '@/graphql';

type PasswordlessBanner = {
  message: string;
  variant: 'positive' | 'negative';
};

/**
 * Password-less login — sends a magic link to the user's email.
 */
export function ForgotPassword() {
  const { t } = useTranslation();
  const [handle, setHandle] = useState('');
  const [banner, setBanner] = useState<PasswordlessBanner | null>(null);
  const [linkSent, setLinkSent] = useState(false);

  const requestMagicMutation = useGraphQLMutation(RequestMagicDocument, {
    onSuccess: () => {
      setLinkSent(true);
      setBanner({
        message: t('auth:passwordlessSuccess'),
        variant: 'positive',
      });
    },
    onError: (err) => {
      console.error('Magic link request failed:', err);
      setBanner({
        message: isTransportError(err)
          ? t('auth:errorTransport')
          : (getGraphQLErrorMessage(err) ?? t('auth:passwordlessError')),
        variant: 'negative',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    requestMagicMutation.mutate({ handle });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xl">
        <Card className="flex flex-col gap-6">
          <h1 className="text-foreground text-center text-2xl font-bold">
            {t('auth:passwordlessTitle')}
          </h1>

          <p className="text-muted-foreground text-center">
            {t('auth:passwordlessDescription')}
          </p>

          {banner && (
            <Banner message={banner.message} variant={banner.variant} />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              value={handle}
              onChange={(value) => {
                setHandle(value);
                if (linkSent) setLinkSent(false);
              }}
              placeholder={t('auth:emailOrUsername')}
              required
              disabled={linkSent}
            />
            <div className="flex items-baseline justify-between">
              <div className="text-center">
                <a
                  href="/login"
                  className="text-muted-foreground hover:text-foreground underline decoration-transparent transition-colors duration-200 hover:decoration-current"
                  tabIndex={0}
                  aria-label={t('auth:backToLogin')}
                >
                  {t('auth:backToLogin')}
                </a>
              </div>
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  loading={requestMagicMutation.isPending}
                  disabled={!handle || linkSent}
                  className="mt-2 w-full"
                >
                  {t('auth:sendMagicLink')}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
