import { useUserStore } from '@/stores/userStore';
import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { useState } from 'react';
import { LogOut, Settings, User } from 'react-feather';
import { Avatar } from './Avatar';
import { ContextMenuDivider, ContextMenuLink, PopoverContent } from './popover';

interface InteractiveAvatarProps {
    className?: string;
}

/**
 * Interactive avatar with popover menu for profile actions
 */
export function InteractiveAvatar({ className }: InteractiveAvatarProps) {
    const [open, setOpen] = useState(false);
    const currentUser = useUserStore(store => store.currentUser);

    const handleMenuClose = () => {
        setOpen(false);
    };

    // Don't render if no user is authenticated
    if (!currentUser) {
        return null;
    }

    const handleLogout = () => {
        // TODO: Implement logout functionality
        console.log('Logout clicked');
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
                    <Avatar src={currentUser.avatar} alt={currentUser.name} className={className} />
                </button>
            </Popover.Trigger>

            <PopoverContent>
                <ContextMenuLink
                    id="profile"
                    label="My Profile"
                    icon={User}
                    to={`/u/${currentUser.handle}`}
                    onClick={handleMenuClose}
                />
                <ContextMenuLink
                    id="settings"
                    label="Settings"
                    icon={Settings}
                    to="/settings"
                    onClick={handleMenuClose}
                />
                <ContextMenuDivider id="divider" />
                <ContextMenuLink
                    id="logout"
                    label="Logout"
                    icon={LogOut}
                    to="/logout"
                    onClick={() => {
                        handleLogout();
                        handleMenuClose();
                    }}
                    variant="destructive"
                />
            </PopoverContent>
        </Popover.Root>
    );
}
