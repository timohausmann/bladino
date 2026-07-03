import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface ListProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

/**
 * Scrollable list container for sidebar navigation items.
 */
export function List({ children, className, label }: ListProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('common:listLabel');

  return (
    <ScrollArea
      className={clsx('min-h-0 flex-1', className)}
      label={resolvedLabel}
    >
      <ul className="space-y-0.5 p-2">{children}</ul>
    </ScrollArea>
  );
}
