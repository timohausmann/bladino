import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * Header component with bladino logo and theme toggle
 */
export function Header() {
    return (
        <header
            style={{
                borderBottom: '1px solid var(--border)',
                padding: '1rem 0',
            }}
        >
            <div className="container flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'var(--foreground)',
                        fontFamily: '"Playfair Display", serif',
                        letterSpacing: '-0.03em'
                    }}
                >
                    bladino
                </Link>

                {/* Theme Toggle */}
                <ThemeToggle />
            </div>
        </header>
    );
} 