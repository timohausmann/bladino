import { useUserStore } from '@/stores/userStore';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

/**
 * Logout route that handles user logout and redirects to login
 */
export function Logout() {
    const navigate = useNavigate();
    const clearCurrentUser = useUserStore(store => store.clearCurrentUser);

    useEffect(() => {
        // TODO: Implement actual logout logic here
        // - Clear authentication tokens
        // - Clear user data from storage
        // - Call logout API endpoint
        // - Clear any cached data

        // Clear current user from store
        clearCurrentUser();
        console.log('User logged out');

        // Redirect to login page after logout
        navigate({ to: '/login' });
    }, [navigate, clearCurrentUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Logging out...</p>
            </div>
        </div>
    );
}
