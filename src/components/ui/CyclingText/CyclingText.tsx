import clsx from 'clsx';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

const DEFAULT_VISIBLE_MS = 5000;
const DEFAULT_FADE_MS = 500;

export interface CyclingTextProps {
  /** Lines to cycle through; nullish entries are omitted. */
  items: ReactNode[];
  /** How long each line stays visible before fading to the next. */
  visibleMs?: number;
  /** Fade in/out duration. */
  fadeMs?: number;
  className?: string;
}

function isVisibleItem(item: ReactNode): boolean {
  return item != null && item !== false;
}

/**
 * Cycles through lines one at a time with a crossfade.
 * All lines share the same grid cell so layout stays stable.
 */
export function CyclingText({
  items,
  visibleMs = DEFAULT_VISIBLE_MS,
  fadeMs = DEFAULT_FADE_MS,
  className,
}: CyclingTextProps) {
  const visibleItems = useMemo(() => items.filter(isVisibleItem), [items]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [visibleItems]);

  useEffect(() => {
    if (visibleItems.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleItems.length);
    }, visibleMs);

    return () => window.clearInterval(intervalId);
  }, [visibleItems, visibleMs]);

  if (visibleItems.length === 0) {
    return null;
  }

  if (visibleItems.length === 1) {
    return <div className={className}>{visibleItems[0]}</div>;
  }

  return (
    <div className={clsx('grid', className)} aria-live="polite">
      {visibleItems.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={index}
            className={clsx(
              'col-start-1 row-start-1 transition-opacity ease-in-out',
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={{ transitionDuration: `${fadeMs}ms` }}
            aria-hidden={!isActive}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
