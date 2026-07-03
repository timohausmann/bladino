import {
  DASHBOARD_MARGIN,
  DASHBOARD_MIN_ROW_HEIGHT,
  DASHBOARD_MIN_ROWS,
} from '@/stores/dashboardStore';

export interface DashboardGridMetrics {
  rowCount: number;
  rowHeight: number;
}

/**
 * Derive row count from layout and stretch rowHeight so the grid fills the
 * container exactly. Row count must not exceed layout usage — extra viewport
 * rows would leave empty space below bottom-aligned widgets.
 */
export function computeDashboardGridMetrics(
  containerHeight: number,
  layoutRowCount = DASHBOARD_MIN_ROWS,
): DashboardGridMetrics {
  const marginY = DASHBOARD_MARGIN[1];
  const paddingY = marginY * 2;

  const rowCount = Math.max(DASHBOARD_MIN_ROWS, layoutRowCount);

  const rowHeight =
    containerHeight > 0
      ? (containerHeight - paddingY - (rowCount - 1) * marginY) / rowCount
      : DASHBOARD_MIN_ROW_HEIGHT;

  return { rowCount, rowHeight };
}

/** Fixed row height for scrollable mobile stacks (no viewport stretching). */
export function computeMobileDashboardGridMetrics(
  layoutRowCount: number,
): DashboardGridMetrics {
  return {
    rowCount: layoutRowCount,
    rowHeight: DASHBOARD_MIN_ROW_HEIGHT,
  };
}
