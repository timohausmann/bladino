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
    <div className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 mb-6 text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        ) : (
          <div className="mb-6" />
        )}
        {children}
      </div>
    </div>
  );
}
