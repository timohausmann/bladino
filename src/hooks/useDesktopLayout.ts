import { useSyncExternalStore } from 'react';

const DESKTOP_LAYOUT_QUERY = '(min-width: 64rem)';

const subscribeToDesktopLayout = (handleChange: () => void) => {
  const mediaQuery = window.matchMedia(DESKTOP_LAYOUT_QUERY);
  mediaQuery.addEventListener('change', handleChange);

  return () => mediaQuery.removeEventListener('change', handleChange);
};

const getDesktopLayoutSnapshot = () =>
  window.matchMedia(DESKTOP_LAYOUT_QUERY).matches;

const getServerDesktopLayoutSnapshot = () => false;

/**
 * Mirrors Tailwind's default `lg` breakpoint for behavior that CSS cannot own.
 */
export const useDesktopLayout = () =>
  useSyncExternalStore(
    subscribeToDesktopLayout,
    getDesktopLayoutSnapshot,
    getServerDesktopLayoutSnapshot,
  );
