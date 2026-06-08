import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { Banner } from '@/components/ui/Banner';
import { Card } from '@/components/ui/Card';
import { LoginDocument, useGraphQLMutation } from '@/graphql';
import { consumeFlashMessage } from '@/lib/flashMessage';
import { setAuthToken } from '@/stores/authStore';
import { useNavigate } from '@tanstack/react-router';
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

    const [formData, setFormData] = useState({
        name: '',
        password: ''
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
        onSuccess: (data) => {
            setAuthToken(data.login);
            navigate({ to: '/' });
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
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg">
                <Card className="flex flex-col gap-6 p-8">
                    <h1 className="text-2xl font-bold text-foreground text-center">Sign in</h1>

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

                        <div className="flex justify-between items-baseline">
                            <div>
                                <Button
                                    type="submit"
                                    loading={loginMutation.isPending}
                                    disabled={!formData.name || !formData.password}
                                    className="w-full mt-2"
                                >
                                    Sign In
                                </Button>
                            </div>
                            <a
                                href="/forgot-password"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200 underline decoration-transparent hover:decoration-current"
                                tabIndex={0}
                                aria-label="Forgot password"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
