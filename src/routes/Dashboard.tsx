import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { DashboardGrid, DashboardToolbar } from '@/components/dashboard';
import { useDashboardWidgetDrag } from '@/components/dashboard/useDashboardWidgetDrag';
import { UsersLastActionDocument, useGraphQLQuery } from '@/graphql';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { data: presenceData } = useGraphQLQuery(UsersLastActionDocument);
  const trashRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const drag = useDashboardWidgetDrag(trashRef, gridRef);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) {
      return;
    }

    main.classList.toggle(styles.dragging, drag.draggingId !== null);

    return () => main.classList.remove(styles.dragging);
  }, [drag.draggingId]);

  return (
    <div
      className={clsx(
        'relative -m-4 flex min-h-0 flex-1 flex-col',
        drag.fadeWidget && styles.dragFaded,
      )}
    >
      <header className="flex shrink-0 justify-end px-4 pt-4 pb-2">
        <DashboardToolbar
          trashRef={trashRef}
          draggingId={drag.draggingId}
          overTrash={drag.overTrash}
        />
      </header>

      <DashboardGrid
        gridRef={gridRef}
        presenceUsers={presenceData?.usersLastAction ?? []}
        isDragging={drag.draggingId !== null}
        skipLayoutChangeRef={drag.skipLayoutChangeRef}
        onDragStart={drag.onDragStart}
        onDrag={drag.onDrag}
        onDragStop={drag.onDragStop}
      />
    </div>
  );
}
