import { Moon, Sun } from 'react-feather';
import { useTheme } from '../ThemeProvider';
import { HeaderButton } from './HeaderButton';

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
        <HeaderButton
            onClick={toggleTheme}
            icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        />
    );
} 