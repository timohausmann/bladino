import {
  contentPanelHeaderClassName,
  contentPanelTitleClassName,
} from '@/components/layout/panelHeader';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ContentPanelHeaderProps {
  title: ReactNode;
  leading?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Uniform 64px content header row (mail subject, settings page title, etc.).
 */
export function ContentPanelHeader({
  title,
  leading,
  className,
  children,
}: ContentPanelHeaderProps) {
  return (
    <header className={twMerge(contentPanelHeaderClassName, className)}>
      {leading}
      {typeof title === 'string' ? (
        <h1 className={contentPanelTitleClassName}>{title}</h1>
      ) : (
        title
      )}
      {children}
    </header>
  );
}
