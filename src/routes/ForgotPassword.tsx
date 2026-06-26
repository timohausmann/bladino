import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

/**
 * Forgot Password page - displays a form with just the email field for password reset
 */
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Password reset requested for:', email);
      setIsLoading(false);
      // In a real app, send password reset email here
    }, 1000);
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xl">
        <Card className="flex flex-col gap-6">
          <h1 className="text-foreground text-center text-2xl font-bold">
            Reset Password
          </h1>

          <p className="text-muted-foreground text-center">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="Email or username"
              required
            />
            <div className="flex items-baseline justify-between">
              <div className="text-center">
                <a
                  href="/login"
                  className="text-muted-foreground hover:text-foreground underline decoration-transparent transition-colors duration-200 hover:decoration-current"
                  tabIndex={0}
                  aria-label="Back to login"
                >
                  Back to login
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
                  Send Reset Link
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
