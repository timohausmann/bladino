import clsx from 'clsx';
import { useEffect } from 'react';
import { NavRail } from '@/components/layout/NavRail';
import {
  useFixedViewport,
  useIsAuthenticatedShell,
  useLayoutMode,
} from '@/components/layout/useAppShell';

interface LayoutProps {
  children: React.ReactNode;
  /**
   * Locks the app to the viewport height so only inner regions scroll.
   * When omitted, routes can opt in via `staticData.fixedViewport`.
   */
  fixedViewport?: boolean;
}

/**
 * App shell: optional nav rail for authenticated routes + flexible content area.
 */
export function Layout({
  children,
  fixedViewport: fixedViewportProp,
}: LayoutProps) {
  const showNavRail = useIsAuthenticatedShell();
  const layoutMode = useLayoutMode();
  const fixedViewport = useFixedViewport(fixedViewportProp);

  useEffect(() => {
    const className = 'fixed-viewport';
    if (fixedViewport) {
      document.documentElement.classList.add(className);
      document.body.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
      document.body.classList.remove(className);
    }

    return () => {
      document.documentElement.classList.remove(className);
      document.body.classList.remove(className);
    };
  }, [fixedViewport]);

  const shellClasses = clsx(
    showNavRail
      ? 'flex flex-row h-dvh min-h-dvh overflow-hidden'
      : clsx(
          'flex flex-col',
          fixedViewport ? 'h-dvh overflow-hidden' : 'min-h-screen',
        ),
  );

  // Master/detail and feed run edge-to-edge; only full-width tools keep padding.
  const mainClasses = clsx(
    'flex-1 flex flex-col min-h-0 min-w-0',
    layoutMode === 'fullWidth' ? 'p-4' : 'p-0',
    fixedViewport ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden',
  );

  // Feed is a single continuous column; kept open (no framing borders).
  const feedWrapperClasses = clsx(
    'flex-1 w-full mx-auto max-w-2xl flex flex-col',
    fixedViewport ? 'min-h-0 overflow-auto' : '',
  );

  return (
    <div className={shellClasses}>
      {showNavRail ? <NavRail /> : null}
      <main className={mainClasses}>
        {layoutMode === 'feed' ? (
          <div className={feedWrapperClasses}>{children}</div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        )}
      </main>
    </div>
  );
}
