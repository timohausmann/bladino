import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * Header component with bladino logo and theme toggle
 */
export function Header() {
    return (
        <header className="border-b border-slate- py-4">
            <div className="container max-w-3xl mx-auto px-4 flex items-center justify-between">
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
        </header>
    );
} 