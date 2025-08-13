import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * Header component with bladino logo and theme toggle
 */
export function Header() {
    return (
        <>
            <header className="fixed top-4 left-4 right-4 z-50">
                <div className="rounded-full py-4 px-4 mx-auto max-w-[calc(768px+2rem)]
            backdrop-blur-sm bg-white/50 dark:bg-white/5 ">
                    <div className="container max-w-3xl px-4 flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="font-bold text-2xl text-foreground font-['Playfair_Display',serif] tracking-tighter"
                        >
                            bladino
                        </Link>

                        {/* Theme Toggle */}
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <div className="h-20"></div>
        </>
    );
} 