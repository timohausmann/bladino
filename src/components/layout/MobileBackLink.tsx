import { headerButtonVariants } from '@/components/ui/headerButtonVariants';
import { Link, type LinkProps } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

interface MobileBackLinkProps {
  to: LinkProps['to'];
  search?: LinkProps['search'];
  label: string;
  className?: string;
}

/**
 * Mobile-only navigation back to a master list or settings index.
 */
export function MobileBackLink({
  to,
  search,
  label,
  className,
}: MobileBackLinkProps) {
  return (
    <Link
      to={to}
      search={search}
      aria-label={label}
      title={label}
      className={clsx(
        headerButtonVariants({ size: 'sm' }),
        'shrink-0 lg:hidden',
        className,
      )}
    >
      <ArrowLeft size={18} aria-hidden />
    </Link>
  );
}
