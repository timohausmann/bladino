import type { ReactNode } from 'react';

interface FeedStreamHeaderProps {
  children: ReactNode;
}

/** Page title for feed-style views (/feed, channels). */
export function FeedStreamHeader({ children }: FeedStreamHeaderProps) {
  return (
    <header>
      <h1 className="text-foreground text-2xl font-bold">{children}</h1>
    </header>
  );
}
