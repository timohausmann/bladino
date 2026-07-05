import {
  DASHBOARD_MARGIN,
  DASHBOARD_MIN_ROW_HEIGHT,
  DASHBOARD_MIN_ROWS,
} from '@/stores/dashboardStore';

/**
 * Stretch row height so the grid fills the container.
 * Row count follows layout usage — extra rows would leave gaps below widgets.
 */
export function computeDashboardGridMetrics(
  containerHeight: number,
  layoutRowCount = DASHBOARD_MIN_ROWS,
) {
  const marginY = DASHBOARD_MARGIN[1];
  const paddingY = marginY * 2;
  const rowCount = Math.max(DASHBOARD_MIN_ROWS, layoutRowCount);
  const rowHeight =
    containerHeight > 0
      ? (containerHeight - paddingY - (rowCount - 1) * marginY) / rowCount
      : DASHBOARD_MIN_ROW_HEIGHT;

  return { rowCount, rowHeight };
}
