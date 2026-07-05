import { useDashboardStore, type WidgetType } from '@/stores/dashboardStore';
import type { EventCallback, LayoutItem } from 'react-grid-layout';
import { useCallback, useRef, useState, type RefObject } from 'react';

function isOver(event: Event, element: HTMLElement | null): boolean {
  if (!element || !('clientX' in event) || !('clientY' in event)) {
    return false;
  }

  const { clientX, clientY } = event as MouseEvent;
  const rect = element.getBoundingClientRect();

  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function widgetId(
  oldItem: LayoutItem | null,
  newItem: LayoutItem | null,
): WidgetType | null {
  const id = newItem?.i ?? oldItem?.i;
  return id ? (id as WidgetType) : null;
}

export function useDashboardWidgetDrag(
  trashRef: RefObject<HTMLDivElement | null>,
  gridRef: RefObject<HTMLDivElement | null>,
) {
  const removeWidget = useDashboardStore((store) => store.removeWidget);
  const skipNextLayoutChange = useRef(false);
  const [draggingId, setDraggingId] = useState<WidgetType | null>(null);
  const [overTrash, setOverTrash] = useState(false);
  const [fadeWidget, setFadeWidget] = useState(false);

  const updateDragVisuals = useCallback(
    (event: Event) => {
      const onTrash = isOver(event, trashRef.current);
      const offGrid =
        gridRef.current !== null && !isOver(event, gridRef.current);

      setOverTrash(onTrash);
      setFadeWidget(onTrash || offGrid);
    },
    [gridRef, trashRef],
  );

  const onDragStart = useCallback<EventCallback>(
    (_layout, oldItem, newItem) => {
      const id = widgetId(oldItem, newItem);
      if (id) {
        setDraggingId(id);
      }
    },
    [],
  );

  const onDrag = useCallback<EventCallback>(
    (_layout, _oldItem, _newItem, _placeholder, event) => {
      updateDragVisuals(event);
    },
    [updateDragVisuals],
  );

  const onDragStop = useCallback<EventCallback>(
    (_layout, oldItem, newItem, _placeholder, event) => {
      const id = widgetId(oldItem, newItem);

      if (id && isOver(event, trashRef.current)) {
        skipNextLayoutChange.current = true;
        removeWidget(id);
      }

      setDraggingId(null);
      setOverTrash(false);
      setFadeWidget(false);
    },
    [removeWidget, trashRef],
  );

  const shouldSkipLayoutChange = useCallback(() => {
    if (!skipNextLayoutChange.current) {
      return false;
    }

    skipNextLayoutChange.current = false;
    return true;
  }, []);

  return {
    draggingId,
    overTrash,
    fadeWidget,
    onDragStart,
    onDrag,
    onDragStop,
    shouldSkipLayoutChange,
  };
}
