import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/ThemeProvider';
import { IconButton } from '@/components/ui/IconButton';

/**
 * ThemeToggle - A button that toggles between light and dark theme
 */
export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton
      onClick={toggleTheme}
      icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      label={
        theme === 'dark'
          ? t('settings:theme.switchToLight')
          : t('settings:theme.switchToDark')
      }
    />
  );
}
