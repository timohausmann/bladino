import { tv } from 'tailwind-variants';

const banner = tv({
  base: ['text-sm text-center p-2 rounded-lg border'],
  variants: {
    variant: {
      positive: [
        'text-emerald-700 dark:text-emerald-400',
        'bg-emerald-500/10 border-emerald-400/60',
      ],
      negative: [
        'text-rose-700 dark:text-rose-400',
        'bg-rose-500/10 border-rose-400/60',
      ],
      info: [
        'text-violet-700 dark:text-violet-400',
        'bg-violet-500/10 border-violet-400/60',
      ],
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

interface BannerProps {
  message: string;
  variant: 'positive' | 'negative' | 'info';
  className?: string;
}

export function Banner({ message, variant, className }: BannerProps) {
  return (
    <p className={banner({ variant, className })} role="alert">
      {message}
    </p>
  );
}
