import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ThemeProviderProps = { children: React.ReactNode; };
type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const defaultTheme = 'dark';

// Create context with default values
const ThemeProviderContext = createContext<ThemeProviderState>({
    theme: defaultTheme,
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
            return storedTheme || defaultTheme;
        }
        return defaultTheme;
    });

    // Apply theme class to document element for Tailwind
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove the class
        root.classList.remove('dark');

        // Add class if dark mode
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'system') {
            // Check system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemTheme) {
                root.classList.add('dark');
            }
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Define the handler function
        const handleChange = () => {
            if (theme === 'system') {
                const root = window.document.documentElement;
                if (mediaQuery.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        // Set up the listener
        mediaQuery.addEventListener('change', handleChange);

        // Initial check
        handleChange();

        // Cleanup
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