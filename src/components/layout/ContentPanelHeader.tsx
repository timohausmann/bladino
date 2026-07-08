import {
  contentPanelHeaderClassName,
  contentPanelTitleClassName,
} from '@/components/layout/panelHeader';
import { twMerge } from 'tailwind-merge';

interface ContentPanelHeaderProps {
  title: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Uniform 64px content header row (mail subject, settings page title, etc.).
 */
export function ContentPanelHeader({
  title,
  className,
  children,
}: ContentPanelHeaderProps) {
  return (
    <header className={twMerge(contentPanelHeaderClassName, className)}>
      {typeof title === 'string' ? (
        <h1 className={contentPanelTitleClassName}>{title}</h1>
      ) : (
        title
      )}
      {children}
    </header>
  );
}
