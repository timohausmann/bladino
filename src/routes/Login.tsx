import { useState } from 'react';
import { Input } from '../components/form/Input';
import { SubmitButton } from '../components/form/SubmitButton';

/**
 * Login page - displays a login form with email and password fields
 */
export function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Login attempt:', formData);
            setIsLoading(false);
            // In a real app, handle authentication here
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
                <div className="flex flex-col gap-6 rounded-xl bg-card text-card-foreground p-4 max-w-full border border-white dark:border-white/10">
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
                                <SubmitButton
                                    type="submit"
                                    loading={isLoading}
                                    disabled={!formData.email || !formData.password}
                                    className="w-full mt-2"
                                >
                                    Sign In
                                </SubmitButton>
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
                </div>
            </div>
        </div>
    );
}
