import { Sun, Moon } from 'react-feather';
import { useTheme } from '../ThemeProvider';

/**
 * ThemeToggle - A button that toggles between light and dark theme
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    // Toggle between light and dark themes
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="bg-transparent border-none cursor-pointer flex items-center justify-center text-foreground w-8 h-8 rounded-full p-0"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
            {theme === 'dark' ? (
                <Sun size={18} />
            ) : (
                <Moon size={18} />
            )}
        </button>
    );
} 