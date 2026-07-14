import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';

interface UnreadIndicatorProps {
  isUnread?: boolean;
  layout?: 'card' | 'comment';
}

/** Aligns the dot with the author name row — slightly above avatar center. */
function getNameDotTopClass(layout: 'card' | 'comment') {
  return layout === 'card' ? 'top-3.75' : 'top-2';
}

/**
 * Unread dot left of posts/comments with tooltip on focus/hover.
 */
export function UnreadIndicator({
  isUnread,
  layout = 'card',
}: UnreadIndicatorProps) {
  const { t } = useTranslation();

  if (!isUnread) {
    return null;
  }

  const label = t('posts:unread');

  return (
    <div
      className={`absolute ${getNameDotTopClass(layout)}`}
      style={{ right: 'calc(100% + 8px)' }}
    >
      <Tooltip content={label} side="left">
        <span
          aria-label={label}
          className="block h-1.75 w-1.75 rounded-full bg-cyan-400"
        />
      </Tooltip>
    </div>
  );
}
