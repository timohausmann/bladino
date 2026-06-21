import clsx from 'clsx';

/** Outer rail width when collapsed (60px). */
export const NAV_RAIL_COLLAPSED_WIDTH = 'w-[3.75rem]';
export const NAV_RAIL_EXPANDED_WIDTH = 'w-56';

/** Section padding — keeps item backgrounds off the rail edges in both states. */
export const navRailSectionClassName = 'px-2';

/**
 * Icon column width = collapsed inner width (60px − 2×8px padding = 44px).
 * Icons are centered here so collapsed + expanded share the same x-position.
 */
export const navRailIconColumnClassName =
    'flex w-11 shrink-0 items-center justify-center self-stretch';

export const navRailLabelClassName =
    'min-w-0 flex-1 truncate text-left text-sm font-medium pr-1';

interface NavRailRowOptions {
    active?: boolean;
    disabled?: boolean;
    /** Compact square icon button (40×40) instead of a full-width row. */
    iconOnly?: boolean;
}

export function navRailRowClassName(options?: NavRailRowOptions) {
    const { active = false, disabled = false, iconOnly = false } = options ?? {};

    return clsx(
        'flex h-10 items-center rounded-xl transition-colors duration-150',
        iconOnly ? 'w-10 shrink-0 justify-center' : 'w-full',
        disabled && 'pointer-events-none cursor-not-allowed opacity-40',
        !disabled &&
            'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
        !disabled && !active && 'hover:bg-neutral-100/90 dark:hover:bg-neutral-800/70',
        active &&
            !disabled &&
            'bg-neutral-200/95 text-neutral-900 dark:bg-neutral-800/95 dark:text-neutral-100',
    );
}

/** @deprecated use navRailIconColumnClassName */
export const navRailIconTrackClassName = navRailIconColumnClassName;
