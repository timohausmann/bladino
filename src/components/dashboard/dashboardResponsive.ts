/** Tailwind-aligned breakpoints: lg = desktop (persisted), xs = mobile stack. */
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
