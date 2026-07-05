import { DASHBOARD_MARGIN } from '@/stores/dashboardStore';
import { calcGridCellDimensions } from 'react-grid-layout/core';
import { useMemo } from 'react';
import styles from './DashboardGrid.module.css';

interface DashboardGridBackgroundProps {
  width: number;
  cols: number;
  rowHeight: number;
  rowCount: number;
}

/**
 * Knot position for column/row index (0 … count inclusive).
 * Offset by -gap/2 so widgets sit centered in the margin-inclusive slots.
 */
function knotPosition(
  index: number,
  offset: number,
  cellSize: number,
  gap: number,
): number {
  return offset + index * (cellSize + gap) - gap / 2;
}

/**
 * Dot grid at slot corners (knot points), aligned to react-grid-layout.
 */
export function DashboardGridBackground({
  width,
  cols,
  rowHeight,
  rowCount,
}: DashboardGridBackgroundProps) {
  const dots = useMemo(() => {
    const dims = calcGridCellDimensions({
      width,
      cols,
      rowHeight,
      margin: DASHBOARD_MARGIN,
      containerPadding: null,
    });

    const points: Array<{ key: string; x: number; y: number }> = [];

    for (let row = 0; row <= rowCount; row++) {
      for (let col = 0; col <= cols; col++) {
        points.push({
          key: `${row}-${col}`,
          x: knotPosition(col, dims.offsetX, dims.cellWidth, dims.gapX),
          y: knotPosition(row, dims.offsetY, dims.cellHeight, dims.gapY),
        });
      }
    }

    return points;
  }, [cols, rowCount, rowHeight, width]);

  if (width <= 0 || rowCount <= 0) return null;

  return (
    <svg className={styles.background} aria-hidden>
      {dots.map((dot) => (
        <circle
          key={dot.key}
          cx={dot.x}
          cy={dot.y}
          r={1.5}
          className={styles.dot}
        />
      ))}
    </svg>
  );
}
