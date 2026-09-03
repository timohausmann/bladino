import { ContentPanelHeader } from '@/components/layout/ContentPanelHeader';
import { MobileBackLink } from '@/components/layout/MobileBackLink';
import { useTranslation } from 'react-i18next';

interface SettingsPanelProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Content wrapper for a single settings page (title, description, constrained width).
 */
export function SettingsPanel({
  title,
  description,
  children,
}: SettingsPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="mx-auto w-full max-w-2xl pb-6">
        <ContentPanelHeader
          title={title}
          leading={<MobileBackLink to="/settings" label={t('common:back')} />}
        />
        <div className="px-4 lg:px-6">
          {description ? (
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
