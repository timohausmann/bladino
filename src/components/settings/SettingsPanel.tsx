import { ContentPanelHeader } from '@/components/layout/ContentPanelHeader';

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
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="mx-auto w-full max-w-2xl px-6 pb-6">
        <ContentPanelHeader title={title} className="px-0" />
        {description ? (
          <p className="mb-6 text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
