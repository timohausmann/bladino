import { Bell } from 'react-feather';
import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { HeaderButton } from '../ui/HeaderButton';
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
                            className="font-bold text-2xl text-foreground font-['Playfair_Display',serif] tracking-tighter"
                        >
                            bladino
                        </Link>

                        <div className="min-w-1/6 flex items-center justify-end gap-4">
                            {/* Notifications placeholder */}
                            <HeaderButton
                                onClick={() => console.log('Notifications clicked')}
                                icon={<Bell size={18} />}
                                label="Notifications"
                            />
                            {/* Theme Toggle */}
                            <ThemeToggle />
                            <Avatar
                                src="https://i.pravatar.cc/150?img=2"
                                alt="avatar"
                                size={10}
                            />
                        </div>
                    </div>
                </div>
            </header>
            <div className="h-20"></div>
        </>
    );
} 