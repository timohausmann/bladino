import clsx from 'clsx';
import type { NoteSaveStatus } from '@/components/notes/types';
import { useTranslation } from 'react-i18next';

interface NoteSaveStatusLabelProps {
  status: NoteSaveStatus;
}

export function NoteSaveStatusLabel({ status }: NoteSaveStatusLabelProps) {
  const { t } = useTranslation();

  const label =
    status === 'saving' || status === 'pending'
      ? t('notes:saving')
      : status === 'saved'
        ? t('notes:saved')
        : status === 'error'
          ? t('notes:saveFailed')
          : null;

  if (!label) {
    return null;
  }

  return (
    <span
      className={clsx(
        'text-sm',
        status === 'error'
          ? 'text-rose-600 dark:text-rose-400'
          : 'text-neutral-500 dark:text-neutral-400',
      )}
    >
      {label}
    </span>
  );
}
