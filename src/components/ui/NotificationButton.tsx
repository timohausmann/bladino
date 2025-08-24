import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { useState } from 'react';
import { Bell } from 'react-feather';
import { HeaderButton } from './HeaderButton';

interface Notification {
    id: string;
    message: string;
    isNew: boolean;
    timestamp: string;
}

interface NotificationButtonProps {
    count?: number;
    notifications?: Notification[];
    onClick?: () => void;
}

/**
 * Notification button with badge showing notification count
 */
export function NotificationButton({ count = 0, notifications = [] }: NotificationButtonProps) {
    const [open, setOpen] = useState(false);

    const handleNotificationClick = () => {
        setOpen(false);
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <div className="relative">
                    <HeaderButton
                        onClick={() => setOpen(!open)}
                        icon={<Bell size={18} />}
                        label="Notifications"
                    />
                    {count > 0 && (
                        <div className="absolute top-0 right-0 min-w-4 px-1 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                                {count > 99 ? '99+' : count}
                            </span>
                        </div>
                    )}
                </div>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="z-50 w-80 rounded-lg bg-white dark:bg-neutral-900 px-3 py-4 shadow-lg border border-neutral-200 dark:border-neutral-700"
                    sideOffset={8}
                    align="end"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            Notifications
                        </h3>
                        {count > 0 && (
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                {count} new
                            </span>
                        )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-1">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={handleNotificationClick}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 p-2 rounded-lg transition-colors cursor-pointer",
                                        notification.isNew
                                            ? "bg-cyan-50 dark:bg-cyan-900/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
                                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-neutral-900 dark:text-neutral-100">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                            {notification.timestamp}
                                        </p>
                                    </div>
                                    {notification.isNew && (
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    <Popover.Arrow className="fill-white dark:fill-neutral-700" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
