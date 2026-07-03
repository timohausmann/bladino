import { Card } from '@/components/ui/Card';
import clsx from 'clsx';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Chrome for a dashboard widget: draggable header + scrollable body.
 * The body uses `.dashboard-widget-body` so react-grid-layout ignores it for drag.
 */
export function DashboardWidget({
  title,
  children,
  className,
}: DashboardWidgetProps) {
  return (
    <Card
      className={clsx(
        'flex h-full min-h-0 flex-col overflow-hidden p-0',
        className,
      )}
    >
      <header
        className={clsx(
          'dashboard-widget-header border-card-border flex w-full shrink-0 cursor-grab items-center gap-2 border-b px-3 py-2',
          'touch-none select-none active:cursor-grabbing',
        )}
      >
        <GripVertical
          size={16}
          className="text-muted-foreground pointer-events-none shrink-0"
          aria-hidden
        />
        <h3 className="text-foreground pointer-events-none truncate text-sm font-semibold">
          {title}
        </h3>
      </header>

      <div className="dashboard-widget-body min-h-0 flex-1 overflow-auto p-3">
        {children}
      </div>
    </Card>
  );
}
