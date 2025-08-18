import dinoAsset from '@/assets/dino-1.svg';
import { Link } from '@tanstack/react-router';
import { InteractiveAvatar } from '../ui/InteractiveAvatar';
import { NotificationButton } from '../ui/NotificationButton';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * Header component with bladino logo and theme toggle
 */
export function Header() {
    return (
        <>
            <header className="fixed top-4 left-4 right-4 z-50">
                <div className="rounded-full py-4 px-8 pr-4 mx-auto max-w-3xl
            backdrop-blur-sm bg-white/50 dark:bg-white/5">
                    <div className="container flex items-center justify-between gap-4">
                        <Link
                            to="/"
                            className="font-bold text-2xl text-foreground font-['Playfair_Display',serif] tracking-tighter
                            flex items-center gap-3"
                        >
                            <img
                                src={dinoAsset}
                                alt="Dinosaur"
                                className="w-7 h-7"
                            />
                            bladino
                        </Link>

                        <div className="min-w-1/6 flex items-center justify-end gap-4">
                            <NotificationButton
                                count={2}
                                notifications={[
                                    {
                                        id: '1',
                                        message: 'Jane Smith liked your post',
                                        isNew: true,
                                        timestamp: '2 minutes ago'
                                    },
                                    {
                                        id: '2',
                                        message: 'New comment on your post',
                                        isNew: true,
                                        timestamp: '5 minutes ago'
                                    },
                                    {
                                        id: '3',
                                        message: 'You have a new follower',
                                        isNew: false,
                                        timestamp: '1 hour ago'
                                    }
                                ]}
                            />
                            {/* Theme Toggle */}
                            <ThemeToggle />
                            <InteractiveAvatar
                                src="https://i.pravatar.cc/150?img=2"
                                alt="avatar"
                                className="w-10 h-10"
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
} 