import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Banner } from '@/components/ui/Banner';
import { Card } from '@/components/ui/Card';
import { LoginDocument, useGraphQLMutation } from '@/graphql';
import { ensureSession, resolveRedirectTarget } from '@/lib/auth';
import { consumeFlashMessage } from '@/lib/flashMessage';
import { queryClient } from '@/lib/queryClient';
import { setAuthToken } from '@/stores/authStore';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

function getLoginErrorMessage(err: Error): string {
  if (err.message.includes('fetch')) {
    return 'Could not reach the server.';
  }
  return 'Login failed. Please check your credentials.';
}

type LoginBanner = {
  message: string;
  variant: 'positive' | 'negative';
};

/**
 * Login page - displays a login form with email and password fields
 */
export function Login() {
  const navigate = useNavigate();
  const { returnTo } = useSearch({ from: '/login' });

  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [banner, setBanner] = useState<LoginBanner | null>(null);

  useEffect(() => {
    if (consumeFlashMessage() === 'loggedOut') {
      setBanner({
        message: 'Logout successful, come back soon!',
        variant: 'positive',
      });
    }
  }, []);

  const loginMutation = useGraphQLMutation(LoginDocument, {
    onSuccess: async (data) => {
      setAuthToken(data.login);
      await ensureSession(queryClient);
      navigate({ to: resolveRedirectTarget(returnTo), replace: true });
    },
    onError: (err) => {
      console.error('Login request failed:', err);
      setBanner({
        message: getLoginErrorMessage(err),
        variant: 'negative',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    loginMutation.mutate({
      name: formData.name,
      password: formData.password,
    });
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-lg">
        <Card className="flex flex-col gap-6 p-8">
          <h1 className="text-foreground text-center text-2xl font-bold">
            Sign in
          </h1>

          {banner && (
            <Banner message={banner.message} variant={banner.variant} />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              placeholder="Username"
              required
            />

            <Input
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Password"
              required
              showPasswordToggle
            />

            <div className="flex items-baseline justify-between">
              <a
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground underline decoration-transparent transition-colors duration-200 hover:decoration-current"
                tabIndex={0}
                aria-label="Forgot password"
              >
                Forgot password?
              </a>
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loginMutation.isPending}
                  disabled={!formData.name || !formData.password}
                  className="mt-2 w-full"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
