import type { NoteSaveStatus } from '@/components/notes/types';
import { Tooltip } from '@/components/ui/Tooltip';
import clsx from 'clsx';
import { Check, CircleAlert, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NoteSaveStatusIndicatorProps {
  status: NoteSaveStatus;
}

export function NoteSaveStatusIndicator({
  status,
}: NoteSaveStatusIndicatorProps) {
  const { t } = useTranslation();

  if (status === 'idle') {
    return null;
  }

  const isWaiting = status === 'pending' || status === 'saving';
  const label = isWaiting
    ? t('notes:saving')
    : status === 'saved'
      ? t('notes:saved')
      : t('notes:saveFailed');

  const icon = isWaiting ? (
    <Clock
      size={14}
      className={clsx(
        'shrink-0 text-neutral-400 dark:text-neutral-500',
        status === 'saving' && 'animate-pulse',
      )}
      aria-hidden
    />
  ) : status === 'saved' ? (
    <Check
      size={14}
      className="shrink-0 text-emerald-600 dark:text-emerald-400"
      aria-hidden
    />
  ) : (
    <CircleAlert
      size={14}
      className="shrink-0 text-rose-600 dark:text-rose-400"
      aria-hidden
    />
  );

  return (
    <Tooltip content={label}>
      <span
        className="inline-flex shrink-0 items-center justify-center"
        aria-label={label}
      >
        {icon}
      </span>
    </Tooltip>
  );
}
