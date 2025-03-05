import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ThemeProviderProps = { children: React.ReactNode; };
type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

// Create context with default values
const ThemeProviderContext = createContext<ThemeProviderState>({
    theme: 'system',
    setTheme: () => null,
});

// Hook to use theme
export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    // Try to get theme from localStorage, default to system
    const [theme, setTheme] = useState<Theme>(() => {
        // Check if we're in the browser
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme') as Theme;
            return storedTheme || 'system';
        }
        return 'system';
    });

    // Apply theme class to root element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const root = window.document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(mediaQuery.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // Store theme preference in localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Provide theme context
    const value = {
        theme,
        setTheme: (theme: Theme) => setTheme(theme),
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
} 