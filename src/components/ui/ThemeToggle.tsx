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
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--foreground)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                padding: '0'
            }}
        >
            {theme === 'dark' ? (
                <Sun size={18} />
            ) : (
                <Moon size={18} />
            )}
        </button>
    );
} 