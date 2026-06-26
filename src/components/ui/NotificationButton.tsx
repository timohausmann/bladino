import { NavRailIconTrack } from '@/components/layout/NavRailIconTrack';
import {
  navRailLabelClassName,
  navRailRowClassName,
} from '@/components/layout/navRailLayout';
import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { PopoverContent } from '@/components/ui/popover';

interface Notification {
  id: string;
  message: string;
  isNew: boolean;
  timestamp: string;
}

interface NotificationButtonProps {
  count?: number;
  notifications?: Notification[];
  expanded?: boolean;
}

function formatCount(count: number): string {
  return count > 99 ? '99+' : String(count);
}

function CountBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={clsx(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-0.5',
        'bg-cyan-300 text-[10px] font-medium text-black tabular-nums text-shadow-2xs',
        className,
      )}
    >
      {formatCount(count)}
    </span>
  );
}

/**
 * Notifications entry — shared icon column row, opens a popover on click.
 */
export function NotificationButton({
  count = 0,
  notifications = [],
  expanded = false,
}: NotificationButtonProps) {
  const [open, setOpen] = useState(false);

  const handleNotificationClick = () => {
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={navRailRowClassName({ active: open })}
          aria-label="Notifications"
        >
          <NavRailIconTrack className="relative">
            <Bell size={20} aria-hidden className="shrink-0" />
            {!expanded && count > 0 ? (
              <span className="pointer-events-none absolute -top-1 right-1">
                <CountBadge
                  count={count}
                  className="h-4 min-w-4 px-1 text-[10px]"
                />
              </span>
            ) : null}
          </NavRailIconTrack>
          {expanded ? (
            <>
              <span className={navRailLabelClassName}>Notifications</span>
              <CountBadge count={count} className="mr-2" />
            </>
          ) : null}
        </button>
      </Popover.Trigger>

      <PopoverContent width="w-80">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Notifications
          </h3>
          {count > 0 && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {count} new
            </span>
          )}
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={handleNotificationClick}
                className={clsx(
                  'flex cursor-pointer items-center gap-3 rounded-lg p-2 px-3 transition-colors',
                  notification.isNew
                    ? 'bg-neutral-50 hover:bg-cyan-100 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {notification.timestamp}
                  </p>
                </div>
                {notification.isNew && (
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">
              <Bell size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </div>

        <Popover.Arrow className="fill-white dark:fill-neutral-700" />
      </PopoverContent>
    </Popover.Root>
  );
}
