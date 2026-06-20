import clsx from 'clsx';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface ListProps {
    children: React.ReactNode;
    className?: string;
    label?: string;
}

/**
 * Scrollable list container for sidebar navigation items.
 */
export function List({ children, className, label = 'List' }: ListProps) {
    return (
        <ScrollArea className={clsx('flex-1 min-h-0', className)} label={label}>
            <ul className="p-2 space-y-0.5">{children}</ul>
        </ScrollArea>
    );
}
