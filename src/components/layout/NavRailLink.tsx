import { NavRailIconTrack } from '@/components/layout/NavRailIconTrack';
import {
    navRailLabelClassName,
    navRailRowClassName,
} from '@/components/layout/navRailLayout';
import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

interface NavRailLinkProps {
    to: string;
    params?: Record<string, string>;
    label: string;
    icon: LucideIcon;
    expanded: boolean;
    disabled?: boolean;
    exact?: boolean;
}

/**
 * Navigation link — always uses the shared icon column so alignment matches in both rail states.
 */
export function NavRailLink({
    to,
    params,
    label,
    icon: Icon,
    expanded,
    disabled = false,
    exact = false,
}: NavRailLinkProps) {
    const inactiveClassName = navRailRowClassName({ disabled });
    const activeClassName = navRailRowClassName({ active: true, disabled });

    const content = (
        <>
            <NavRailIconTrack>
                <Icon size={20} aria-hidden className="shrink-0" />
            </NavRailIconTrack>
            {expanded ? <span className={navRailLabelClassName}>{label}</span> : null}
        </>
    );

    if (disabled) {
        return (
            <div className={inactiveClassName} aria-disabled title={label}>
                {content}
            </div>
        );
    }

    return (
        <Link
            to={to}
            params={params}
            title={expanded ? undefined : label}
            activeOptions={{ exact }}
            className={inactiveClassName}
            activeProps={{ className: activeClassName }}
            inactiveProps={{ className: inactiveClassName }}
        >
            {content}
        </Link>
    );
}
