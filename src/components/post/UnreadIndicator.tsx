import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';

interface UnreadIndicatorProps {
  isUnread?: boolean;
  /** `label` sits beside a date; `dot` marks the start of comment text. */
  variant: 'label' | 'dot';
}

/**
 * Unread mark for a post or comment.
 * The label variant is metadata; the dot variant is inline, so new replies sit slightly indented.
 */
export function UnreadIndicator({ isUnread, variant }: UnreadIndicatorProps) {
  const { t } = useTranslation();

  if (!isUnread) {
    return null;
  }

  const label = t('posts:unread');

  if (variant === 'label') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 text-cyan-500 dark:text-cyan-400">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="text-[10px] leading-none font-semibold tracking-wide uppercase">
          {label}
        </span>
      </span>
    );
  }

  return (
    <Tooltip content={label} side="top">
      {/* Match comment text leading-6 so the dot centers on the first line. */}
      <span
        aria-label={label}
        className="inline-flex h-6 shrink-0 items-center"
      >
        <span
          aria-hidden
          className="block h-1.75 w-1.75 rounded-full bg-cyan-500 dark:bg-cyan-400"
        />
      </span>
    </Tooltip>
  );
}
