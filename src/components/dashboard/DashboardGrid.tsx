import type { UsersLastActionQuery } from '@/graphql';
import {
  DASHBOARD_MARGIN,
  DASHBOARD_MIN_ROWS,
  DASHBOARD_RESIZE_HANDLES,
  useDashboardStore,
} from '@/stores/dashboardStore';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from 'react';
import ReactGridLayout, {
  useContainerWidth,
  useResponsiveLayout,
  type Layout,
  type LayoutItem,
} from 'react-grid-layout';
import { noCompactor, verticalCompactor } from 'react-grid-layout/core';
import { DashboardGridBackground } from './DashboardGridBackground';
import {
  computeDashboardGridMetrics,
  computeMobileDashboardGridMetrics,
} from './dashboardGridMetrics';
import {
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLS_BY_BREAKPOINT,
  isMobileDashboardBreakpoint,
  isPersistedDashboardBreakpoint,
  type DashboardBreakpoint,
} from './dashboardResponsive';
import { CommunityWidget } from './widgets/CommunityWidget';
import { PostOfTheDayWidget } from './widgets/PostOfTheDayWidget';
import { ServerStatusWidget } from './widgets/ServerStatusWidget';
import { WeatherWidget } from './widgets/WeatherWidget';

interface DashboardGridProps {
  presenceUsers?: UsersLastActionQuery['usersLastAction'];
}

const WIDGET_MIN_W = 2;
const WIDGET_MIN_H = 2;

const DASHBOARD_COMPACTOR = { ...noCompactor, preventCollision: true };

function normalizeLayout(layout: Layout): LayoutItem[] {
  return layout.map(({ i, x, y, w, h, static: isStatic, minW, minH }) => ({
    i,
    x,
    y,
    w,
    h,
    minW: minW ?? WIDGET_MIN_W,
    minH: minH ?? WIDGET_MIN_H,
    resizeHandles: [...DASHBOARD_RESIZE_HANDLES],
    ...(isStatic ? { static: isStatic } : {}),
  }));
}

function layoutRows(layout: Layout): number {
  const usedRows = layout.reduce(
    (max, item) => Math.max(max, item.y + item.h),
    0,
  );

  return Math.max(DASHBOARD_MIN_ROWS, usedRows);
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

    const updateHeight = () => {
      setHeight(node.clientHeight);
    };

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
export function DashboardGrid({ presenceUsers = [] }: DashboardGridProps) {
  const { width, containerRef, mounted } = useContainerWidth();
  const storedLayout = useDashboardStore((store) => store.layout);
  const widgetTypes = useDashboardStore((store) => store.widgetTypes);
  const persistLayout = useDashboardStore((store) => store.setLayout);
  const [hasHydrated, setHasHydrated] = useState(() =>
    useDashboardStore.persist.hasHydrated(),
  );
  const containerHeight = useContainerHeight(
    containerRef as RefObject<HTMLDivElement | null>,
    hasHydrated,
  );

  const desktopLayouts = useMemo(
    () => ({ lg: normalizeLayout(storedLayout) }),
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

  const isMobile = isMobileDashboardBreakpoint(breakpoint);

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
      return computeMobileDashboardGridMetrics(rows);
    }

    return computeDashboardGridMetrics(containerHeight, rows);
  }, [containerHeight, isMobile, layout]);

  const onLayoutChange = useCallback(
    (nextLayout: Layout) => {
      const normalized = normalizeLayout(nextLayout);
      setLayoutForBreakpoint(breakpoint as DashboardBreakpoint, normalized);

      if (isPersistedDashboardBreakpoint(breakpoint)) {
        persistLayout(normalized);
      }
    },
    [breakpoint, persistLayout, setLayoutForBreakpoint],
  );

  const children = useMemo(
    () =>
      layout.map((item) => (
        <div key={item.i} className="h-full min-h-0">
          <WidgetShell
            type={widgetTypes[item.i]}
            presenceUsers={presenceUsers}
          />
        </div>
      )),
    [layout, widgetTypes, presenceUsers],
  );

  if (!hasHydrated) {
    return <div ref={containerRef} className="relative min-h-0 flex-1" />;
  }

  const gridReady = mounted && width > 0 && (isMobile || containerHeight > 0);

  return (
    <div
      ref={containerRef}
      className={
        isMobile
          ? 'relative min-h-0 flex-1 overflow-y-auto'
          : 'relative min-h-0 flex-1'
      }
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
              bounded: true,
              handle: '.dashboard-widget-header',
              cancel: '.dashboard-widget-body, .dashboard-widget-body *',
            }}
            resizeConfig={{
              enabled: !isMobile,
              handles: [...DASHBOARD_RESIZE_HANDLES],
            }}
            onLayoutChange={onLayoutChange}
            className="dashboard-grid"
          >
            {children}
          </ReactGridLayout>
        </div>
      )}
    </div>
  );
}

interface WidgetShellProps {
  type: string | undefined;
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
