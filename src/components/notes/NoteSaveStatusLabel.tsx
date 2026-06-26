import clsx from 'clsx';
import type { NoteSaveStatus } from '@/components/notes/types';

interface NoteSaveStatusLabelProps {
  status: NoteSaveStatus;
}

export function NoteSaveStatusLabel({ status }: NoteSaveStatusLabelProps) {
  const label =
    status === 'saving' || status === 'pending'
      ? 'Saving…'
      : status === 'saved'
        ? 'Saved'
        : status === 'error'
          ? 'Could not save'
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
