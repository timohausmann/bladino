import type { ReactNode } from 'react';

interface FeedStreamHeaderProps {
  children: ReactNode;
}

/** Page title for feed-style views (/feed, channels). */
export function FeedStreamHeader({ children }: FeedStreamHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-transparent py-3">
      <h1 className="text-foreground text-xl font-bold">{children}</h1>
    </header>
  );
}
