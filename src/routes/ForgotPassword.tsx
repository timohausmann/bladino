import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

/**
 * Forgot Password page - displays a form with just the email field for password reset
 */
export function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log('Password reset requested for:', email);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xl">
        <Card className="flex flex-col gap-6">
          <h1 className="text-foreground text-center text-2xl font-bold">
            {t('auth:resetPasswordTitle')}
          </h1>

          <p className="text-muted-foreground text-center">
            {t('auth:resetPasswordDescription')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder={t('auth:emailOrUsername')}
              required
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
                  loading={isLoading}
                  disabled={!email}
                  className="mt-2 w-full"
                >
                  {t('auth:sendResetLink')}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
