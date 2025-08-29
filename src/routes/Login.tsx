import { getUserByEmail } from '@/mocks/users';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '../components/form/Button';
import { Input } from '../components/form/Input';
import { Card } from '../components/ui/Card';

/**
 * Login page - displays a login form with email and password fields
 */
export function Login() {
    const navigate = useNavigate();
    const setCurrentUser = useUserStore(store => store.setCurrentUser);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            console.log('Login attempt:', formData);

            const user = getUserByEmail(formData.email);
            if (user) {
                setCurrentUser(user);
                console.log('Login successful:', user.name);
                navigate({ to: '/' });
            } else {
                console.log('Login failed: User not found');
            }

            setIsLoading(false);
        }, 1000);
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
            <div className="w-full max-w-xl">
                <Card className="flex flex-col gap-6">
                    <h1 className="text-2xl font-bold text-foreground text-center">Sign in</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="text"
                            value={formData.email}
                            onChange={(value) => handleInputChange('email', value)}
                            placeholder="Email or username"
                            required
                        />

                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(value) => handleInputChange('password', value)}
                            placeholder="Password"
                            required
                        />

                        <div className="flex justify-between items-baseline">
                            <div>
                                <Button
                                    type="submit"
                                    loading={isLoading}
                                    disabled={!formData.email || !formData.password}
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
