import {
  useBackgroundStyle,
  type BackgroundStyle,
} from '@/components/BackgroundStyleProvider';
import { useTheme } from '@/components/ThemeProvider';
import { SettingsPanel, SettingsSelectField } from '@/components/settings';
import {
  normalizeLanguage,
  setLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/i18n';
import { useTranslation } from 'react-i18next';

const THEME_OPTIONS = ['dark', 'light', 'system'] as const;
const BACKGROUND_STYLE_OPTIONS = ['pattern', 'plain'] as const;

export function SettingsAppearance() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { backgroundStyle, setBackgroundStyle } = useBackgroundStyle();
  const currentLanguage = normalizeLanguage(i18n.language);

  const languageOptions = SUPPORTED_LANGUAGES.map((language) => ({
    value: language,
    label: t(`settings:language.options.${language}`),
  }));

  const themeOptions = THEME_OPTIONS.map((option) => ({
    value: option,
    label: t(`settings:theme.options.${option}`),
  }));

  const backgroundStyleOptions = BACKGROUND_STYLE_OPTIONS.map((option) => ({
    value: option,
    label: t(`settings:background.options.${option}`),
  }));

  return (
    <SettingsPanel
      title={t('settings:display.title')}
      description={t('settings:display.description')}
    >
      <div className="space-y-8">
        <SettingsSelectField
          label={t('settings:language.label')}
          value={currentLanguage}
          onValueChange={(value) => setLanguage(value as SupportedLanguage)}
          placeholder={t('settings:language.placeholder')}
          options={languageOptions}
        />
        <SettingsSelectField
          label={t('settings:theme.label')}
          value={theme}
          onValueChange={(value) =>
            setTheme(value as (typeof THEME_OPTIONS)[number])
          }
          placeholder={t('settings:theme.placeholder')}
          options={themeOptions}
        />
        <SettingsSelectField
          label={t('settings:background.label')}
          value={backgroundStyle}
          onValueChange={(value) =>
            setBackgroundStyle(value as BackgroundStyle)
          }
          placeholder={t('settings:background.placeholder')}
          options={backgroundStyleOptions}
        />
      </div>
    </SettingsPanel>
  );
}
