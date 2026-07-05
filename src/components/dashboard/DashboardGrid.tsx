import type { UsersLastActionQuery } from '@/graphql';
import {
  DASHBOARD_MARGIN,
  DASHBOARD_MIN_ROW_HEIGHT,
  DASHBOARD_MIN_ROWS,
  DASHBOARD_RESIZE_HANDLES,
  normalizeDashboardLayout,
  useDashboardStore,
  type WidgetType,
} from '@/stores/dashboardStore';
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type MutableRefObject,
  type RefObject,
} from 'react';
import ReactGridLayout, {
  useContainerWidth,
  useResponsiveLayout,
  type EventCallback,
  type Layout,
} from 'react-grid-layout';
import { noCompactor, verticalCompactor } from 'react-grid-layout/core';
import clsx from 'clsx';
import { DashboardGridBackground } from './DashboardGridBackground';
import styles from './DashboardGrid.module.css';
import { computeDashboardGridMetrics } from './dashboardGridMetrics';
import {
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLS_BY_BREAKPOINT,
  type DashboardBreakpoint,
} from './dashboardResponsive';
import { CommunityWidget } from './widgets/CommunityWidget';
import { PostOfTheDayWidget } from './widgets/PostOfTheDayWidget';
import { ServerStatusWidget } from './widgets/ServerStatusWidget';
import { WeatherWidget } from './widgets/WeatherWidget';

interface DashboardGridProps {
  presenceUsers?: UsersLastActionQuery['usersLastAction'];
  gridRef?: RefObject<HTMLDivElement | null>;
  isDragging?: boolean;
  skipLayoutChangeRef?: MutableRefObject<boolean>;
  onDragStart?: EventCallback;
  onDrag?: EventCallback;
  onDragStop?: EventCallback;
}

const DASHBOARD_COMPACTOR = { ...noCompactor, preventCollision: true };

function layoutRows(layout: Layout): number {
  const usedRows = layout.reduce(
    (max, item) => Math.max(max, item.y + item.h),
    0,
  );

  return Math.max(DASHBOARD_MIN_ROWS, usedRows);
}

function layoutMatchesStore(nextLayout: Layout, storedLayout: Layout): boolean {
  if (nextLayout.length !== storedLayout.length) {
    return false;
  }

  const nextIds = new Set(nextLayout.map((item) => item.i));
  return storedLayout.every((item) => nextIds.has(item.i));
}

function useContainerHeight(
  containerRef: RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!active) return;

    const node = containerRef.current;
    if (!node) return;

    const updateHeight = () => setHeight(node.clientHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => observer.disconnect();
  }, [active, containerRef]);

  return height;
}

/**
 * Dot-grid dashboard backed by react-grid-layout with free positioning.
 */
export function DashboardGrid({
  presenceUsers = [],
  gridRef,
  isDragging = false,
  skipLayoutChangeRef,
  onDragStart,
  onDrag,
  onDragStop,
}: DashboardGridProps) {
  const { width, containerRef, mounted } = useContainerWidth();
  const storedLayout = useDashboardStore((store) => store.layout);
  const layoutVersion = useDashboardStore((store) => store.layoutVersion);
  const persistLayout = useDashboardStore((store) => store.setLayout);
  const [hasHydrated, setHasHydrated] = useState(() =>
    useDashboardStore.persist.hasHydrated(),
  );
  const containerHeight = useContainerHeight(
    containerRef as RefObject<HTMLDivElement | null>,
    hasHydrated,
  );

  const desktopLayouts = useMemo(
    () => ({ lg: normalizeDashboardLayout(storedLayout) }),
    [storedLayout],
  );

  const { layout, breakpoint, cols, setLayoutForBreakpoint } =
    useResponsiveLayout({
      width,
      breakpoints: DASHBOARD_BREAKPOINTS,
      cols: DASHBOARD_COLS_BY_BREAKPOINT,
      layouts: desktopLayouts,
      compactor: verticalCompactor,
    });

  useLayoutEffect(() => {
    if (!hasHydrated) return;

    setLayoutForBreakpoint(
      'lg',
      normalizeDashboardLayout(useDashboardStore.getState().layout),
    );
  }, [hasHydrated, layoutVersion, setLayoutForBreakpoint]);

  const isMobile = breakpoint === 'xs';

  useEffect(() => {
    const syncHydration = () => setHasHydrated(true);

    if (useDashboardStore.persist.hasHydrated()) {
      syncHydration();
      return;
    }

    return useDashboardStore.persist.onFinishHydration(syncHydration);
  }, []);

  const gridMetrics = useMemo(() => {
    const rows = layoutRows(layout);

    if (isMobile) {
      return { rowCount: rows, rowHeight: DASHBOARD_MIN_ROW_HEIGHT };
    }

    return computeDashboardGridMetrics(containerHeight, rows);
  }, [containerHeight, isMobile, layout]);

  const setGridContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (gridRef) {
        gridRef.current = node;
      }
    },
    [containerRef, gridRef],
  );

  const onLayoutChange = useCallback(
    (nextLayout: Layout) => {
      if (skipLayoutChangeRef?.current) {
        skipLayoutChangeRef.current = false;
        return;
      }

      const normalized = normalizeDashboardLayout(nextLayout);

      // Ignore stale grid updates that still contain removed or not-yet-added widgets.
      if (!layoutMatchesStore(normalized, storedLayout)) {
        return;
      }

      setLayoutForBreakpoint(breakpoint as DashboardBreakpoint, normalized);

      if (breakpoint === 'lg') {
        persistLayout(normalized);
      }
    },
    [
      breakpoint,
      persistLayout,
      setLayoutForBreakpoint,
      skipLayoutChangeRef,
      storedLayout,
    ],
  );

  const children = useMemo(
    () =>
      layout.map((item) => (
        <div key={item.i} className="h-full min-h-0">
          <WidgetShell
            type={item.i as WidgetType}
            presenceUsers={presenceUsers}
          />
        </div>
      )),
    [layout, presenceUsers],
  );

  if (!hasHydrated) {
    return (
      <div ref={setGridContainerRef} className="relative min-h-0 flex-1" />
    );
  }

  const gridReady = mounted && width > 0 && (isMobile || containerHeight > 0);

  return (
    <div
      ref={setGridContainerRef}
      className={clsx(
        'relative min-h-0 flex-1',
        isDragging && 'overflow-visible',
        isMobile && 'overflow-y-auto',
      )}
    >
      {gridReady && (
        <div className={isMobile ? 'relative min-h-full' : 'absolute inset-0'}>
          {!isMobile && (
            <DashboardGridBackground
              width={width}
              cols={cols}
              rowHeight={gridMetrics.rowHeight}
              rowCount={gridMetrics.rowCount}
            />
          )}

          <ReactGridLayout
            width={width}
            layout={layout}
            autoSize={isMobile}
            style={isMobile ? undefined : { height: containerHeight }}
            compactor={DASHBOARD_COMPACTOR}
            gridConfig={{
              cols,
              rowHeight: gridMetrics.rowHeight,
              margin: [...DASHBOARD_MARGIN] as [number, number],
              containerPadding: null,
              maxRows: isMobile ? layoutRows(layout) : gridMetrics.rowCount,
            }}
            dragConfig={{
              enabled: !isMobile,
              bounded: false,
              handle: '.dashboard-widget-header',
              cancel: '.dashboard-widget-body, .dashboard-widget-body *',
            }}
            resizeConfig={{
              enabled: !isMobile,
              handles: [...DASHBOARD_RESIZE_HANDLES],
            }}
            onLayoutChange={onLayoutChange}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragStop={onDragStop}
            className={styles.grid}
          >
            {children}
          </ReactGridLayout>
        </div>
      )}
    </div>
  );
}

interface WidgetShellProps {
  type: WidgetType;
  presenceUsers: UsersLastActionQuery['usersLastAction'];
}

const WidgetShell = memo(function WidgetShell({
  type,
  presenceUsers,
}: WidgetShellProps) {
  switch (type) {
    case 'community':
      return <CommunityWidget users={presenceUsers} />;
    case 'weather':
      return <WeatherWidget />;
    case 'postOfTheDay':
      return <PostOfTheDayWidget />;
    case 'serverStatus':
      return <ServerStatusWidget />;
    default:
      return null;
  }
});
