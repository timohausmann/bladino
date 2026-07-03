/**
 * Tailwind-aligned dashboard breakpoints.
 * lg = full desktop grid (persisted), sm = tablet, xs = phone stack.
 */
export const DASHBOARD_BREAKPOINTS = {
  lg: 1024,
  sm: 640,
  xs: 0,
} as const;

export type DashboardBreakpoint = keyof typeof DASHBOARD_BREAKPOINTS;

export const DASHBOARD_COLS_BY_BREAKPOINT: Record<DashboardBreakpoint, number> =
  {
    lg: 12,
    sm: 6,
    xs: 1,
  };

export function isMobileDashboardBreakpoint(
  breakpoint: string,
): breakpoint is 'xs' {
  return breakpoint === 'xs';
}

/** Only the large desktop layout is saved to localStorage. */
export function isPersistedDashboardBreakpoint(
  breakpoint: string,
): breakpoint is 'lg' {
  return breakpoint === 'lg';
}
