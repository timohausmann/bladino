import { twMerge } from 'tailwind-merge';

/** Soft elevation for surfaces that float on the app background. */
export const floatingSurfaceClassName =
  'shadow-[0_18px_48px_-24px_rgb(0_0_0_/_0.28)] dark:shadow-[0_24px_56px_-28px_rgb(0_0_0_/_0.5)]';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  viewTransitionName?: string;
}

export function Card({ children, className, viewTransitionName }: CardProps) {
  const classes = twMerge(
    'rounded-xl border border-surface-border bg-surface p-4 text-surface-foreground',
    floatingSurfaceClassName,
    className,
  );

  return (
    <div className={classes} style={{ viewTransitionName }}>
      {children}
    </div>
  );
}
