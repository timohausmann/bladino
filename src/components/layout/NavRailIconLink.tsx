import { navRailRowClassName } from '@/components/layout/navRailLayout';
import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

interface NavRailIconLinkProps {
    to: string;
    params?: Record<string, string>;
    label: string;
    icon: LucideIcon;
    disabled?: boolean;
    exact?: boolean;
}

/**
 * Icon-only nav link — compact 40×40 button with the same hover/active styles as rail rows.
 */
export function NavRailIconLink({
    to,
    params,
    label,
    icon: Icon,
    disabled = false,
    exact = false,
}: NavRailIconLinkProps) {
    const inactiveClassName = navRailRowClassName({ disabled, iconOnly: true });
    const activeClassName = navRailRowClassName({ active: true, disabled, iconOnly: true });

    if (disabled) {
        return (
            <div
                className={inactiveClassName}
                aria-disabled
                title={label}
            >
                <Icon size={20} aria-hidden className="shrink-0" />
            </div>
        );
    }

    return (
        <Link
            to={to}
            params={params}
            title={label}
            aria-label={label}
            activeOptions={{ exact }}
            className={inactiveClassName}
            activeProps={{ className: activeClassName }}
            inactiveProps={{ className: inactiveClassName }}
        >
            <Icon size={20} aria-hidden className="shrink-0" />
        </Link>
    );
}
