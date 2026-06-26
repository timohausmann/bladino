import { LoaderCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SpinnerProps {
  className?: string;
  size?: number;
}

/** Loading indicator — LoaderCircle with a linear infinite spin. */
export function Spinner({ className, size = 20 }: SpinnerProps) {
  return (
    <LoaderCircle
      size={size}
      aria-hidden
      className={twMerge('text-muted-foreground animate-spin', className)}
    />
  );
}
