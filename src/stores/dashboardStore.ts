import type { Layout } from 'react-grid-layout';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType =
  | 'community'
  | 'weather'
  | 'postOfTheDay'
  | 'serverStatus';

export const ALL_WIDGET_TYPES: WidgetType[] = [
  'community',
  'weather',
  'postOfTheDay',
  'serverStatus',
];

export const DASHBOARD_COLS = 12;
export const DASHBOARD_MIN_ROWS = 8;
export const DASHBOARD_MIN_ROW_HEIGHT = 72;
export const DASHBOARD_MARGIN: readonly [number, number] = [16, 16];

export const DASHBOARD_RESIZE_HANDLES = [
  's',
  'w',
  'e',
  'n',
  'sw',
  'nw',
  'se',
  'ne',
] as const;

const WIDGET_DEFAULTS: Record<
  WidgetType,
  { x: number; y: number; w: number; h: number }
> = {
  community: { x: 0, y: 4, w: 3, h: 4 },
  weather: { x: 3, y: 4, w: 3, h: 4 },
  postOfTheDay: { x: 6, y: 4, w: 3, h: 4 },
  serverStatus: { x: 9, y: 6, w: 2, h: 2 },
};

function layoutItem(type: WidgetType) {
  const { x, y, w, h } = WIDGET_DEFAULTS[type];
  return {
    i: type,
    x,
    y,
    w,
    h,
    minW: 2,
    minH: 2,
    resizeHandles: [...DASHBOARD_RESIZE_HANDLES],
  };
}

const DEFAULT_LAYOUT: Layout = [layoutItem('community')];

function normalizeDashboardLayout(layout: Layout): Layout {
  return layout.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW ?? 2,
    minH: item.minH ?? 2,
    resizeHandles: item.resizeHandles ?? [...DASHBOARD_RESIZE_HANDLES],
    ...(item.static ? { static: item.static } : {}),
  }));
}

interface DashboardState {
  layout: Layout;
  /** Syncs grid after add/remove — RGL internal state lags behind the store. */
  layoutVersion: number;
  setLayout: (layout: Layout) => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (type: WidgetType) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      layout: DEFAULT_LAYOUT,
      layoutVersion: 0,
      setLayout: (layout) => set({ layout: normalizeDashboardLayout(layout) }),
      addWidget: (type) =>
        set((state) => {
          if (state.layout.some((item) => item.i === type)) {
            return state;
          }

          return {
            layout: [...state.layout, layoutItem(type)],
            layoutVersion: state.layoutVersion + 1,
          };
        }),
      removeWidget: (type) =>
        set((state) => ({
          layout: state.layout.filter((item) => item.i !== type),
          layoutVersion: state.layoutVersion + 1,
        })),
    }),
    {
      name: 'bladino.dashboard',
      partialize: (state) => ({ layout: state.layout }),
    },
  ),
);

export { normalizeDashboardLayout };
