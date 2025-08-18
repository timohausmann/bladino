import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'react-feather';

/**
 * Back component - provides navigation back to home page
 * Uses feather arrow-left icon with "Back" text
 */
export function Back() {
    return (
        <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
            <ArrowLeft size={16} />
            <span>Return home</span>
        </Link>
    );
}
