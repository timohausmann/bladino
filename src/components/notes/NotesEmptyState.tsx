import { useTranslation } from 'react-i18next';

export function NotesEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
      {t('notes:empty')}
    </div>
  );
}
