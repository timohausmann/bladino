import type { ViewTransitionType } from '@/constants/viewTransitions';
import { flushSync } from 'react-dom';

const VIEW_TRANSITION_ATTRIBUTE = 'data-view-transition';

let activeTransitionOwner: symbol | undefined;

interface RunViewTransitionOptions {
  /** Identifies the transition in scoped CSS selectors. */
  type: ViewTransitionType;
  /** Synchronously updates the React state captured by the transition. */
  update: () => void;
}

/**
 * Runs a scoped React view transition with an instant accessibility fallback.
 *
 * The ownership token prevents a superseded transition from clearing the
 * marker of its replacement.
 */
export const runViewTransition = ({
  type,
  update,
}: RunViewTransitionOptions): ViewTransition | null => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    update();
    return null;
  }

  const startViewTransition = document.startViewTransition?.bind(document);
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (!startViewTransition || prefersReducedMotion) {
    update();
    return null;
  }

  const root = document.documentElement;
  const owner = Symbol(type);

  const clearMarker = () => {
    if (activeTransitionOwner !== owner) {
      return;
    }

    activeTransitionOwner = undefined;
    root.removeAttribute(VIEW_TRANSITION_ATTRIBUTE);
  };

  let didStartUpdate = false;

  try {
    const transition = startViewTransition(() => {
      didStartUpdate = true;
      flushSync(update);
    });

    // Starting can fail synchronously; preserve any existing marker until the
    // browser has returned a handle for this transition.
    activeTransitionOwner = owner;
    root.setAttribute(VIEW_TRANSITION_ATTRIBUTE, type);

    // Normal lifecycle skips, including superseded transitions, reject ready.
    void transition.ready.catch(() => undefined);

    // Handle both outcomes so a rejected transition cannot leak its marker.
    void transition.finished.then(clearMarker, clearMarker);
    return transition;
  } catch {
    if (!didStartUpdate) {
      update();
    }

    return null;
  }
};
