import type { Layout } from 'react-grid-layout';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType =
  | 'community'
  | 'weather'
  | 'postOfTheDay'
  | 'serverStatus';

export const DASHBOARD_COLS = 12;
export const DASHBOARD_MIN_ROWS = 8;
/** Target minimum row height when calculating how many rows fit in the viewport. */
export const DASHBOARD_MIN_ROW_HEIGHT = 72;
export const DASHBOARD_MARGIN: readonly [number, number] = [16, 16];

/** All edge and corner resize handles for dashboard widgets. */
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

const DEFAULT_LAYOUT: Layout = [
  {
    i: 'community',
    x: 0,
    y: 4,
    w: 3,
    h: 4,
    minW: 2,
    minH: 2,
    resizeHandles: [...DASHBOARD_RESIZE_HANDLES],
  },
  {
    i: 'weather',
    x: 3,
    y: 4,
    w: 3,
    h: 4,
    minW: 2,
    minH: 2,
    resizeHandles: [...DASHBOARD_RESIZE_HANDLES],
  },
  {
    i: 'postOfTheDay',
    x: 6,
    y: 4,
    w: 3,
    h: 4,
    minW: 2,
    minH: 2,
    resizeHandles: [...DASHBOARD_RESIZE_HANDLES],
  },
  {
    i: 'serverStatus',
    x: 9,
    y: 6,
    w: 2,
    h: 2,
    minW: 2,
    minH: 2,
    resizeHandles: [...DASHBOARD_RESIZE_HANDLES],
  },
];

const DEFAULT_WIDGET_TYPES: Record<string, WidgetType> = {
  community: 'community',
  weather: 'weather',
  postOfTheDay: 'postOfTheDay',
  serverStatus: 'serverStatus',
};

interface DashboardState {
  layout: Layout;
  widgetTypes: Record<string, WidgetType>;
  setLayout: (layout: Layout) => void;
  resetLayout: () => void;
}

interface PersistedDashboardState {
  layout: Layout;
  widgetTypes: Record<string, WidgetType>;
}

interface LegacyPersistedState {
  widgets?: Array<{
    id: string;
    type: WidgetType;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      layout: DEFAULT_LAYOUT,
      widgetTypes: DEFAULT_WIDGET_TYPES,
      setLayout: (layout) =>
        set({
          layout: layout.map((item) => ({
            i: item.i,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            minW: item.minW ?? 2,
            minH: item.minH ?? 2,
            resizeHandles: item.resizeHandles ?? [...DASHBOARD_RESIZE_HANDLES],
            ...(item.static ? { static: item.static } : {}),
          })),
        }),
      resetLayout: () =>
        set({ layout: DEFAULT_LAYOUT, widgetTypes: DEFAULT_WIDGET_TYPES }),
    }),
    {
      name: 'bladino.dashboard',
      version: 4,
      migrate: (persistedState, version) => {
        let state = persistedState as PersistedDashboardState;

        if (version === 0) {
          const legacy = persistedState as LegacyPersistedState;
          if (legacy.widgets?.length) {
            state = {
              layout: legacy.widgets.map((widget) => ({
                i: widget.id,
                x: widget.x,
                y: widget.y,
                w: widget.w,
                h: widget.h,
              })),
              widgetTypes: Object.fromEntries(
                legacy.widgets.map((widget) => [widget.id, widget.type]),
              ),
            };
          }
        }

        if (
          version < 2 &&
          !state.layout.some((item) => item.i === 'serverStatus')
        ) {
          state = {
            ...state,
            layout: [
              ...state.layout,
              {
                i: 'serverStatus',
                x: 9,
                y: 0,
                w: 2,
                h: 2,
                minW: 2,
                minH: 2,
                resizeHandles: [...DASHBOARD_RESIZE_HANDLES],
              },
            ],
            widgetTypes: {
              ...state.widgetTypes,
              serverStatus: 'serverStatus',
            },
          };
        }

        if (version < 3) {
          state = {
            ...state,
            layout: state.layout.map((item) =>
              item.i === 'serverStatus'
                ? { ...item, w: 2, h: 2, minW: 2, minH: 2 }
                : item,
            ),
          };
        }

        if (version < 4) {
          const hadOnlyTopRow = state.layout.every((item) => item.y === 0);

          if (hadOnlyTopRow) {
            state = {
              ...state,
              layout: state.layout.map((item) => ({
                ...item,
                y: item.h === 2 ? 6 : 4,
              })),
            };
          }
        }

        return state;
      },
    },
  ),
);
