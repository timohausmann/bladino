import * as Popover from '@radix-ui/react-popover';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { useState } from 'react';
import { LogOut, Settings, User } from 'react-feather';
import { Avatar } from './Avatar';

interface InteractiveAvatarProps {
    src: string;
    alt: string;
    className?: string;
}

/**
 * Interactive avatar with popover menu for profile actions
 */
export function InteractiveAvatar({ src, alt, className }: InteractiveAvatarProps) {
    const [open, setOpen] = useState(false);

    const handleLinkClick = () => {
        setOpen(false);
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    className={clsx(
                        'rounded-full transition-all duration-200',
                        open && 'ring-2 ring-cyan-500 dark:ring-white/90'
                    )}
                    aria-label="Open profile menu"
                >
                    <Avatar src={src} alt={alt} className={className} />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="z-50 w-48 rounded-lg bg-white dark:bg-neutral-900 p-2 shadow-lg border border-neutral-200 dark:border-neutral-700"
                    sideOffset={8}
                    align="end"
                >
                    <div className="space-y-1">
                        <div onClick={handleLinkClick}>
                            <Link
                                to="/u/janesmith"
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                            >
                                <User size={16} />
                                My Profile
                            </Link>
                        </div>

                        <div onClick={handleLinkClick}>
                            <Link
                                to="/settings"
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                            >
                                <Settings size={16} />
                                Settings
                            </Link>
                        </div>

                        <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />

                        <div onClick={handleLinkClick}>
                            <Link
                                to="/logout"
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-neutral-100 dark:hover:bg-red-900/20 transition-colors duration-150"
                            >
                                <LogOut size={16} />
                                Logout
                            </Link>
                        </div>
                    </div>

                    <Popover.Arrow className="fill-white dark:fill-neutral-700" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
